import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as XLSX from 'xlsx';

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

    const data = companies.map((company) => ({
      Name: company.name,
      'Name (Arabic)': company.nameAr || '',
      Description: company.description,
      'Description (Arabic)': company.descriptionAr || '',
      Category: company.category || '',
      Website: company.website || '',
      Email: company.email || '',
      Phone: company.phone || '',
      LinkedIn: company.linkedin || '',
      Twitter: company.twitter || '',
      Instagram: company.instagram || '',
      Booth: company.booth || '',
      Hall: company.hall || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Companies');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="leap-companies.xlsx"',
      },
    });
  } catch (error) {
    console.error('Error exporting Excel:', error);
    return NextResponse.json(
      { error: 'Failed to export Excel' },
      { status: 500 }
    );
  }
}
