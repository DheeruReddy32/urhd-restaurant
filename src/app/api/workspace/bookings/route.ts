import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    let where: any = {};
    if (user && user.role === 'CUSTOMER') {
      where.userId = user.id;
    }
    const bookings = await prisma.workspaceBooking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { package: true },
    });
    return NextResponse.json({ bookings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const {
      packageId,
      guestName,
      guestEmail,
      guestPhone,
      date,
      startTime,
      seats,
      specialRequests,
      paymentStatus,
    } = body;

    if (!packageId || !date || !startTime || !guestName || !guestPhone) {
      return NextResponse.json(
        { error: 'Package, date, start time, name, and phone are required.' },
        { status: 400 }
      );
    }

    const pkg = await prisma.workspacePackage.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Workspace package not found' }, { status: 404 });
    }

    const seatCount = Math.max(1, parseInt(seats) || 1);
    const totalAmount = pkg.price * seatCount;

    const booking = await prisma.workspaceBooking.create({
      data: {
        userId: user?.id || null,
        guestName,
        guestEmail,
        guestPhone,
        packageId,
        date,
        startTime,
        seats: seatCount,
        totalAmount,
        status: 'CONFIRMED',
        paymentStatus: paymentStatus || 'PAY_AT_CAFE',
        specialRequests: specialRequests || null,
      },
      include: {
        package: true,
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (err: any) {
    console.error('Workspace booking error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
