import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const individualsPath = path.join(__dirname, '..', 'data', 'individuals.json');
  
  if (!fs.existsSync(individualsPath)) {
    console.error('individuals.json not found. Please run scrape-individuals.ts first.');
    process.exit(1);
  }

  const individualsData = JSON.parse(fs.readFileSync(individualsPath, 'utf-8'));
  
  console.log(`Seeding ${individualsData.length} individuals...`);

  // Clear existing individuals
  await prisma.individual.deleteMany({});
  console.log('Cleared existing individuals');

  // Insert individuals
  for (const individual of individualsData) {
    try {
      await prisma.individual.create({
        data: {
          name: individual.name,
          nameAr: individual.nameAr,
          title: individual.title,
          company: individual.company,
          email: individual.email,
          phone: individual.phone,
          linkedin: individual.linkedin,
          twitter: individual.twitter,
          instagram: individual.instagram,
          bio: individual.bio,
          bioAr: individual.bioAr,
          category: individual.category,
          booth: individual.booth,
          hall: individual.hall,
        },
      });
    } catch (error) {
      console.error(`Error inserting individual ${individual.name}:`, error);
    }
  }

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
