import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });

    const headers = [
      'Name',
      'Name (Arabic)',
      'Description',
      'Description (Arabic)',
      'Website',
      'Email',
      'Phone',
      'LinkedIn',
      'Twitter',
      'Instagram',
      'Booth',
      'Hall',
    ];

    const csvRows = [
      headers.join(','),
      ...companies.map((company) =>
        [
          company.name,
          company.nameAr || '',
          company.description.replace(/,/g, ';'),
          company.descriptionAr?.replace(/,/g, ';') || '',
          company.website || '',
          company.email || '',
          company.phone || '',
          company.linkedin || '',
          company.twitter || '',
          company.instagram || '',
          company.booth || '',
          company.hall || '',
        ].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="cybersecurity-companies.csv"',
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
