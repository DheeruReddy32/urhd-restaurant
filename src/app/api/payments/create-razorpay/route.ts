export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

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

    const amountInPaise = Math.round(order.totalAmount * 100);
    const receipt = `rcpt_${order.orderNumber}`;

    // Generate razorpay order ID (or test mode order ID)
    let razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    // If real credentials exist, could invoke Razorpay API:
    // const instance = new Razorpay({ key_id: ..., key_secret: ... });
    // const rzpOrder = await instance.orders.create({...})

    // Store razorpayOrderId in payment table
    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          razorpayOrderId,
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
      razorpayOrderId,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_urhd88192mock',
    });
  } catch (err: any) {
    console.error('Payment order creation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
