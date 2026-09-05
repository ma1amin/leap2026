import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ids = searchParams.get('ids');
    const category = searchParams.get('category');
    const hall = searchParams.get('hall');

    const where: any = {};

    if (ids) {
      where.id = { in: ids.split(',') };
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (hall && hall !== 'all') {
      where.hall = hall;
    }

    const individuals = await (prisma as any).individual.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(individuals, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="leap-individuals.json"',
      },
    });
  } catch (error) {
    console.error('Error exporting JSON:', error);
    return NextResponse.json(
      { error: 'Failed to export JSON' },
      { status: 500 }
    );
  }
}
