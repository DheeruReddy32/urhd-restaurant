import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // 1. Total and Today's Revenue
    const allCompletedOrders = await prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
      },
      select: {
        totalAmount: true,
        createdAt: true,
        status: true,
      },
    });

    const totalRevenue = allCompletedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayOrders = allCompletedOrders.filter((o) => new Date(o.createdAt) >= startOfToday);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // 2. Order counts by status
    const totalOrdersCount = await prisma.order.count();
    const pendingOrdersCount = await prisma.order.count({
      where: { status: { in: ['PLACED', 'CONFIRMED', 'PREPARING'] } },
    });
    const completedOrdersCount = await prisma.order.count({
      where: { status: 'DELIVERED' },
    });
    const cancelledOrdersCount = await prisma.order.count({
      where: { status: 'CANCELLED' },
    });

    const averageOrderValue =
      allCompletedOrders.length > 0 ? Math.round(totalRevenue / allCompletedOrders.length) : 0;

    // 3. Best selling dishes
    const orderItemsGrouped = await prisma.orderItem.groupBy({
      by: ['menuItemId'],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const bestSellers = [];
    for (const item of orderItemsGrouped) {
      const dish = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
        select: { id: true, name: true, price: true, imageUrl: true, isVeg: true },
      });
      if (dish) {
        bestSellers.push({
          ...dish,
          soldCount: item._sum.quantity || 0,
          revenueGenerated: item._sum.totalPrice || 0,
        });
      }
    }

    // 4. Low Stock Inventory Alerts
    const lowStockItems = await prisma.inventoryItem.findMany({
      where: {
        OR: [
          { isLowStock: true },
          { quantity: { lte: prisma.inventoryItem.fields.reorderLevel } },
        ],
      },
    });

    // 5. Total customers count
    const customerCount = await prisma.user.count({
      where: { role: 'CUSTOMER' },
    });

    // 6. Recent Orders for quick glance
    const recentOrders = await prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        table: true,
        payment: true,
        items: { include: { menuItem: true } },
      },
    });

    return NextResponse.json({
      metrics: {
        totalRevenue,
        todayRevenue,
        totalOrdersCount,
        pendingOrdersCount,
        completedOrdersCount,
        cancelledOrdersCount,
        averageOrderValue,
        customerCount,
      },
      bestSellers,
      lowStockItems,
      recentOrders,
    });
  } catch (err: any) {
    console.error('Metrics fetch error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
