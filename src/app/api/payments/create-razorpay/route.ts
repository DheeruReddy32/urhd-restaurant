export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    const amountInPaise = Math.round(order.totalAmount * 100);

    // Call Razorpay Orders API directly — no SDK needed
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${order.orderNumber}`,
        notes: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      }),
    });

    if (!rzpResponse.ok) {
      const errData = await rzpResponse.json();
      console.error('Razorpay order creation failed:', errData);
      return NextResponse.json(
        { error: errData?.error?.description || 'Failed to create Razorpay order' },
        { status: 502 }
      );
    }

    const rzpOrder = await rzpResponse.json();

    // Save the Razorpay order ID to the payment record
    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          razorpayOrderId: rzpOrder.id,
          paymentMethod: 'RAZORPAY',
        },
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.totalAmount,
      amountInPaise,
      currency: 'INR',
      razorpayOrderId: rzpOrder.id,
      keyId,
    });
  } catch (err: any) {
    console.error('Payment order creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
