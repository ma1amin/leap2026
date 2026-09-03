import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

interface Company {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  website?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  booth?: string;
  hall?: string;
}

async function main() {
  try {
    console.log('Reading companies data...');
    const dataPath = path.join(__dirname, '..', 'data', 'companies.json');
    const data = fs.readFileSync(dataPath, 'utf-8');
    const companies: Company[] = JSON.parse(data);

    console.log(`Found ${companies.length} companies to seed`);

    // Clear existing data
    console.log('Clearing existing companies...');
    await prisma.company.deleteMany();

    // Insert companies
    console.log('Seeding companies...');
    for (const company of companies) {
      await prisma.company.create({
        data: {
          name: company.name,
          nameAr: company.nameAr,
          description: company.description,
          descriptionAr: company.descriptionAr,
          website: company.website,
          email: company.email,
          phone: company.phone,
          linkedin: company.linkedin,
          twitter: company.twitter,
          instagram: company.instagram,
          booth: company.booth,
          hall: company.hall,
        },
      });
    }

    console.log(`Successfully seeded ${companies.length} companies`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
