import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const individual = await (prisma as any).individual.findUnique({
      where: { id: params.id },
    });

    if (!individual) {
      return NextResponse.json({ error: 'Individual not found' }, { status: 404 });
    }

    return NextResponse.json(individual);
  } catch (error) {
    console.error('Error fetching individual:', error);
    return NextResponse.json({ error: 'Failed to fetch individual' }, { status: 500 });
  }
}
