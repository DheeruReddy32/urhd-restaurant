import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let where: any = {};

    // Role-based filtering
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (user.role === 'CUSTOMER') {
      where.userId = user.id;
    } else if (user.role === 'KITCHEN') {
      // Kitchen is interested in active preparation orders by default
      if (status) {
        where.status = status;
      } else {
        where.status = { in: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'] };
      }
    } else if (user.role === 'ADMIN') {
      if (status && status !== 'ALL') {
        where.status = status;
      }
    }

    if (type) {
      where.orderType = type;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        table: true,
        deliveryAddress: true,
        payment: true,
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json({ orders, count: orders.length });
  } catch (err: any) {
    console.error('Fetch orders error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      orderType, // DELIVERY or DINE_IN
      tableNumber,
      deliveryAddressId,
      newDeliveryAddress,
      specialInstructions,
      paymentMethod, // COD, UPI_QR, RAZORPAY
      items,
      couponCode,
    } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    if (orderType === 'DINE_IN' && !tableNumber) {
      return NextResponse.json({ error: 'Table number is required for dine-in orders' }, { status: 400 });
    }

    // Verify or find table for dine-in
    let tableId: string | null = null;
    if (orderType === 'DINE_IN') {
      const tableRecord = await prisma.diningTable.findUnique({
        where: { number: parseInt(tableNumber) },
      });
      if (tableRecord) {
        tableId = tableRecord.id;
        await prisma.diningTable.update({
          where: { id: tableRecord.id },
          data: { status: 'OCCUPIED' },
        });
      }
    }

    // Verify delivery address
    let finalAddressId = deliveryAddressId;
    if (orderType === 'DELIVERY') {
      if (!finalAddressId && newDeliveryAddress) {
        const createdAddr = await prisma.address.create({
          data: {
            userId: user?.id || 'guest',
            label: newDeliveryAddress.label || 'Home',
            street: newDeliveryAddress.street,
            landmark: newDeliveryAddress.landmark || null,
            city: newDeliveryAddress.city || 'Bangalore',
            state: newDeliveryAddress.state || 'Karnataka',
            pincode: newDeliveryAddress.pincode,
            isDefault: false,
          },
        });
        finalAddressId = createdAddr.id;
      }
    }

    // Server-side recalculation of subtotal to prevent tampering
    let subtotal = 0;
    const orderItemsToCreate: any[] = [];

    for (const item of items) {
      const dbItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId || item.menuItem?.id },
      });

      if (!dbItem) {
        return NextResponse.json({ error: `Dish not found: ${item.menuItemId}` }, { status: 404 });
      }

      let extraPrice = 0;
      if (item.selectedCustomizations && Array.isArray(item.selectedCustomizations)) {
        extraPrice = item.selectedCustomizations.reduce((acc: number, c: any) => acc + (c.price || 0), 0);
      }

      const unitPrice = dbItem.price + extraPrice;
      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      orderItemsToCreate.push({
        menuItemId: dbItem.id,
        quantity,
        unitPrice,
        totalPrice: lineTotal,
        customizationsJson: item.selectedCustomizations ? JSON.stringify(item.selectedCustomizations) : null,
        specialNotes: item.specialInstructions || null,
      });
    }

    // Coupon discount verification
    let discount = 0;
    if (couponCode) {
      const dbCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (dbCoupon && dbCoupon.isActive && new Date() <= new Date(dbCoupon.validUntil)) {
        if (subtotal >= dbCoupon.minOrderAmount) {
          if (dbCoupon.discountType === 'PERCENTAGE') {
            discount = Math.round((subtotal * dbCoupon.discountValue) / 100);
            if (dbCoupon.maxDiscount && discount > dbCoupon.maxDiscount) {
              discount = dbCoupon.maxDiscount;
            }
          } else {
            discount = dbCoupon.discountValue;
          }
          if (discount > subtotal) discount = subtotal;

          // Increment coupon usage
          await prisma.coupon.update({
            where: { id: dbCoupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryFee = orderType === 'DELIVERY' ? (subtotal >= 600 ? 0 : 40) : 0;
    const totalAmount = Math.max(0, subtotal + tax + deliveryFee - discount);

    // Generate unique order number (e.g., URHD-2024-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `URHD-${orderType === 'DINE_IN' ? 'DIN' : 'DEL'}-${Date.now().toString().slice(-4)}${randomSuffix}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: user?.id || null,
        customerName: customerName || user?.name || 'Valued Guest',
        customerPhone: customerPhone || user?.phone || '9999999999',
        customerEmail: customerEmail || user?.email || null,
        orderType,
        tableId,
        deliveryAddressId: finalAddressId,
        status: 'PLACED',
        subtotal,
        tax,
        deliveryFee,
        discount,
        totalAmount,
        specialInstructions: specialInstructions || null,
        estimatedTime: orderType === 'DINE_IN' ? '15-20 mins' : '30-45 mins',
        items: {
          create: orderItemsToCreate,
        },
        payment: {
          create: {
            amount: totalAmount,
            currency: 'INR',
            paymentMethod: paymentMethod || 'COD',
            paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
            transactionId: null,
          },
        },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
        payment: true,
        table: true,
      },
    });

    // Award loyalty points to signed-in users (1 point per ₹20 spent)
    if (user?.id) {
      const earnedPoints = Math.floor(totalAmount / 20);
      if (earnedPoints > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: { loyaltyPoints: { increment: earnedPoints } },
        });
      }
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
