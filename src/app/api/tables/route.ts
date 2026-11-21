export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const tables = await prisma.diningTable.findMany({
      orderBy: { number: 'asc' },
    });
    return NextResponse.json({ tables });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
