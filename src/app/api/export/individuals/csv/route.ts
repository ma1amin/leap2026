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

    const headers = [
      'Name',
      'Name (Arabic)',
      'Title',
      'Company',
      'Email',
      'Phone',
      'LinkedIn',
      'Twitter',
      'Instagram',
      'Bio',
      'Bio (Arabic)',
      'Category',
      'Booth',
      'Hall',
    ];

    const rows = individuals.map((individual: any) => [
      individual.name,
      individual.nameAr || '',
      individual.title || '',
      individual.company || '',
      individual.email || '',
      individual.phone || '',
      individual.linkedin || '',
      individual.twitter || '',
      individual.instagram || '',
      individual.bio?.replace(/,/g, ';') || '',
      individual.bioAr?.replace(/,/g, ';') || '',
      individual.category || '',
      individual.booth || '',
      individual.hall || '',
    ]);

    const csv = [headers.join(','), ...rows.map((row: any) => row.join(','))].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leap-individuals.csv"',
      },
    });
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    );
  }
}
