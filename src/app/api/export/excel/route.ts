import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });

    const data = companies.map((company) => ({
      Name: company.name,
      'Name (Arabic)': company.nameAr || '',
      Description: company.description,
      'Description (Arabic)': company.descriptionAr || '',
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

    return new NextResponse(buffer as Buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="cybersecurity-companies.xlsx"',
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
