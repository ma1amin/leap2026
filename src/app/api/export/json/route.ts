import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ids = searchParams.get('ids');
    const category = searchParams.get('category');

    const where: any = {};

    if (ids) {
      where.id = { in: ids.split(',') };
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    const companies = await prisma.company.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(companies, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="leap-companies.json"',
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
