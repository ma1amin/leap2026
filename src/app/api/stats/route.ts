import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [total, withWebsites, withEmail, withPhone, withSocial, companies, 
          totalIndividuals, individualsWithEmail, individualsWithPhone, 
          individualsWithSocial, individuals] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { website: { not: null } } }),
      prisma.company.count({ where: { email: { not: null } } }),
      prisma.company.count({ where: { phone: { not: null } } }),
      prisma.company.count({ 
        where: { 
          OR: [
            { linkedin: { not: null } },
            { twitter: { not: null } },
            { instagram: { not: null } },
          ],
        },
      }),
      prisma.company.findMany({
        select: { category: true, hall: true },
      }),
      // Individual statistics
      (prisma as any).individual.count(),
      (prisma as any).individual.count({ where: { email: { not: null } } }),
      (prisma as any).individual.count({ where: { phone: { not: null } } }),
      (prisma as any).individual.count({ 
        where: { 
          OR: [
            { linkedin: { not: null } },
            { twitter: { not: null } },
            { instagram: { not: null } },
          ],
        },
      }),
      (prisma as any).individual.findMany({
        select: { category: true, hall: true },
      }),
    ]);

    const byCategory: Record<string, number> = {};
    const byHall: Record<string, number> = {};
    companies.forEach((company) => {
      const cat = company.category || 'other';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
      
      if (company.hall) {
        byHall[company.hall] = (byHall[company.hall] || 0) + 1;
      }
    });

    const byCategoryIndividuals: Record<string, number> = {};
    const byHallIndividuals: Record<string, number> = {};
    individuals.forEach((individual: any) => {
      const cat = individual.category || 'other';
      byCategoryIndividuals[cat] = (byCategoryIndividuals[cat] || 0) + 1;
      
      if (individual.hall) {
        byHallIndividuals[individual.hall] = (byHallIndividuals[individual.hall] || 0) + 1;
      }
    });

    return NextResponse.json({
      total,
      withWebsites,
      withEmail,
      withPhone,
      withSocial,
      byCategory,
      byHall,
      // Individual statistics
      totalIndividuals,
      individualsWithEmail,
      individualsWithPhone,
      individualsWithSocial,
      byCategoryIndividuals,
      byHallIndividuals,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
