import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const packages = await prisma.workspacePackage.findMany();
    const formatted = packages.map((pkg) => ({
      ...pkg,
      features: JSON.parse(pkg.features),
    }));
    return NextResponse.json({ packages: formatted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
