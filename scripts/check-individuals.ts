import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.individual.count();
  console.log('Individuals count:', count);
  
  if (count === 0) {
    console.log('\nNo individuals found in database.');
    console.log('To add individuals:');
    console.log('1. Extract Firefox session cookies from https://connect.onegiantleap.com/event/leap2026/people/RXZlbnRWaWV3XzIwNzA1NzI=');
    console.log('2. Save cookies as cookies.json in project root');
    console.log('3. Run: npx ts-node scripts/scrape-individuals.ts');
    console.log('4. Run: npx ts-node scripts/seed-individuals.ts');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
