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

    const companies = await prisma.company.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const headers = [
      'Name',
      'Name (Arabic)',
      'Description',
      'Description (Arabic)',
      'Category',
      'Website',
      'Email',
      'Phone',
      'LinkedIn',
      'Twitter',
      'Instagram',
      'Booth',
      'Hall',
    ];

    const rows = companies.map((company) => [
      company.name,
      company.nameAr || '',
      company.description.replace(/,/g, ';'),
      company.descriptionAr?.replace(/,/g, ';') || '',
      company.category || '',
      company.website || '',
      company.email || '',
      company.phone || '',
      company.linkedin || '',
      company.twitter || '',
      company.instagram || '',
      company.booth || '',
      company.hall || '',
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leap-companies.csv"',
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
