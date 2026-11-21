import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const item = await prisma.inventoryItem.create({
      data: {
        name: body.name,
        category: body.category || 'Produce',
        quantity: parseFloat(body.quantity || 0),
        unit: body.unit || 'kg',
        reorderLevel: parseFloat(body.reorderLevel || 10),
        isLowStock: parseFloat(body.quantity || 0) <= parseFloat(body.reorderLevel || 10),
        supplierName: body.supplierName || null,
        supplierPhone: body.supplierPhone || null,
        lastRestocked: new Date(),
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, quantity, reorderLevel, name, unit } = await req.json();

    const existing = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const newQty = quantity !== undefined ? parseFloat(quantity) : existing.quantity;
    const newReorder = reorderLevel !== undefined ? parseFloat(reorderLevel) : existing.reorderLevel;
    const isLowStock = newQty <= newReorder;

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: {
        quantity: newQty,
        reorderLevel: newReorder,
        name: name !== undefined ? name : existing.name,
        unit: unit !== undefined ? unit : existing.unit,
        isLowStock,
        lastRestocked: new Date(),
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
