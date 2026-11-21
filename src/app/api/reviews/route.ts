export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const menuItemId = searchParams.get('menuItemId');

    let where: any = {};
    if (menuItemId) {
      where.menuItemId = menuItemId;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { menuItem: true },
    });

    return NextResponse.json({ reviews });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const { menuItemId, rating, comment, customerName } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Rating and comment are required' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId: user?.id || null,
        menuItemId: menuItemId || null,
        rating: Math.min(5, Math.max(1, parseInt(rating))),
        comment: comment.trim(),
        customerName: customerName || user?.name || 'Valued Guest',
        isVerified: true,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
