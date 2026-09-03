import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(companies, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="cybersecurity-companies.json"',
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
