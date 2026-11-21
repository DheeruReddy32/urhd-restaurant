export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentMethod, // 'RAZORPAY', 'UPI_QR', 'COD'
      upiTransactionId,
    } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order || !order.payment) {
      return NextResponse.json({ error: 'Order or payment record not found' }, { status: 404 });
    }

    // Prevent duplicate payment
    if (order.payment.paymentStatus === 'COMPLETED') {
      return NextResponse.json({
        success: true,
        message: 'Order has already been verified and paid.',
        orderNumber: order.orderNumber,
      });
    }

    let isVerified = false;
    let finalTxnId = razorpayPaymentId || upiTransactionId || `TXN-${Date.now()}`;

    if (paymentMethod === 'RAZORPAY') {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json({ error: 'Missing Razorpay payment credentials' }, { status: 400 });
      }

      const secret = process.env.RAZORPAY_KEY_SECRET!;
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
      }

      isVerified = true;

    } else if (paymentMethod === 'UPI_QR') {
      if (!upiTransactionId || upiTransactionId.trim().length < 4) {
        return NextResponse.json({ error: 'Valid UPI reference / UTR number is required' }, { status: 400 });
      }
      isVerified = true;
      finalTxnId = upiTransactionId.trim();

    } else if (paymentMethod === 'COD') {
      isVerified = true;
      finalTxnId = `COD-${order.orderNumber}`;
    }

    if (!isVerified) {
      return NextResponse.json({ error: 'Payment could not be verified' }, { status: 400 });
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
        paymentMethod,
        razorpayPaymentId: razorpayPaymentId || null,
        razorpaySignature: razorpaySignature || null,
        transactionId: finalTxnId,
        paidAt: paymentMethod === 'COD' ? null : new Date(),
      },
    });

    // Confirm the order
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'CONFIRMED' },
      include: {
        payment: true,
        items: { include: { menuItem: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedOrder,
    });
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
