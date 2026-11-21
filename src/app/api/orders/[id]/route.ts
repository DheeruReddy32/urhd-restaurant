import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: params.id }, { orderNumber: params.id }],
      },
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

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'KITCHEN')) {
      return NextResponse.json({ error: 'Unauthorized to update order status' }, { status: 403 });
    }

    const { status, estimatedTime } = await req.json();

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: status || undefined,
        estimatedTime: estimatedTime || undefined,
      },
      include: {
        table: true,
        deliveryAddress: true,
        payment: true,
        items: {
          include: { menuItem: true },
        },
      },
    });

    // If delivered or cancelled and dine-in, free the table
    if ((status === 'DELIVERED' || status === 'CANCELLED') && updated.tableId) {
      await prisma.diningTable.update({
        where: { id: updated.tableId },
        data: { status: 'AVAILABLE' },
      });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
