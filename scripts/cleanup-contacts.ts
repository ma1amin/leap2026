import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Valid email regex
const validEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Valid phone regex (basic check for reasonable phone numbers)
const validPhoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

function isValidEmail(email: string): boolean {
  if (!email) return false;
  return validEmailRegex.test(email) && 
    !email.includes('example') && 
    !email.includes('test') &&
    !email.includes('noreply') &&
    !email.includes('no-reply') &&
    !email.includes('sentry') &&
    !email.includes('wixpress') &&
    !email.includes('.jpg') &&
    !email.includes('.png');
}

function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  // Remove all non-numeric characters for validation
  const cleaned = phone.replace(/\D/g, '');
  // Phone should be between 7 and 15 digits
  return cleaned.length >= 7 && cleaned.length <= 15;
}

async function cleanupContacts() {
  console.log('Starting contact data cleanup...');
  
  const companies = await prisma.company.findMany();
  
  for (const company of companies) {
    let needsUpdate = false;
    const updateData: any = {};
    
    // Clean up email
    if (company.email && !isValidEmail(company.email)) {
      console.log(`Removing invalid email for ${company.name}: ${company.email}`);
      updateData.email = null;
      needsUpdate = true;
    }
    
    // Clean up phone
    if (company.phone && !isValidPhone(company.phone)) {
      console.log(`Removing invalid phone for ${company.name}: ${company.phone}`);
      updateData.phone = null;
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      await prisma.company.update({
        where: { id: company.id },
        data: updateData,
      });
      console.log(`Cleaned up ${company.name}`);
    }
  }
  
  console.log('Contact cleanup completed');
}

async function main() {
  try {
    await cleanupContacts();
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
