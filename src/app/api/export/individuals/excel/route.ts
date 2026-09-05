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

    const individuals = await (prisma as any).individual.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const data = individuals.map((individual: any) => ({
      Name: individual.name,
      'Name (Arabic)': individual.nameAr || '',
      Title: individual.title || '',
      Company: individual.company || '',
      Email: individual.email || '',
      Phone: individual.phone || '',
      LinkedIn: individual.linkedin || '',
      Twitter: individual.twitter || '',
      Instagram: individual.instagram || '',
      Bio: individual.bio || '',
      'Bio (Arabic)': individual.bioAr || '',
      Category: individual.category || '',
      Booth: individual.booth || '',
      Hall: individual.hall || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Individuals');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="leap-individuals.xlsx"',
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
