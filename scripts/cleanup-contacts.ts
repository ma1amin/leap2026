import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Valid email regex
const validEmailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

// Valid phone regex (international formats)
const phoneRegexes = [
  /\+?[1-9]\d{1,14}[\s-]?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}/g,
  /\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
];

// Social media URL patterns
const socialPatterns = {
  linkedin: /linkedin\.com\/(?:company|in)\/[\w-]+/i,
  twitter: /twitter\.com\/[\w-]+/i,
  instagram: /instagram\.com\/[\w-]+/i,
};

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
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 7 && cleaned.length <= 15;
}

function extractEmailFromMalformed(text: string): string | null {
  const matches = text.match(validEmailRegex);
  if (matches && matches.length > 0) {
    for (const email of matches) {
      if (isValidEmail(email)) {
        return email;
      }
    }
  }
  return null;
}

function extractPhoneFromMalformed(text: string): string | null {
  for (const regex of phoneRegexes) {
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      for (const phone of matches) {
        const cleaned = phone.trim();
        if (isValidPhone(cleaned)) {
          return cleaned;
        }
      }
    }
  }
  return null;
}

function extractSocialFromMalformed(text: string): { linkedin?: string; twitter?: string; instagram?: string } {
  const result: { linkedin?: string; twitter?: string; instagram?: string } = {};
  
  if (socialPatterns.linkedin.test(text)) {
    const match = text.match(socialPatterns.linkedin);
    if (match) {
      result.linkedin = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
    }
  }
  
  if (socialPatterns.twitter.test(text)) {
    const match = text.match(socialPatterns.twitter);
    if (match) {
      result.twitter = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
    }
  }
  
  if (socialPatterns.instagram.test(text)) {
    const match = text.match(socialPatterns.instagram);
    if (match) {
      result.instagram = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
    }
  }
  
  return result;
}

async function cleanupContacts() {
  console.log('Starting contact data cleanup...');
  
  const companies = await prisma.company.findMany();
  
  for (const company of companies) {
    let needsUpdate = false;
    const updateData: any = {};
    
    // Clean up email - try to extract from malformed strings
    if (company.email) {
      if (isValidEmail(company.email)) {
        // Valid email, keep it
      } else {
        // Try to extract valid email from malformed string
        const extractedEmail = extractEmailFromMalformed(company.email);
        if (extractedEmail && extractedEmail !== company.email) {
          console.log(`Extracted valid email for ${company.name}: ${company.email} -> ${extractedEmail}`);
          updateData.email = extractedEmail;
          needsUpdate = true;
        } else {
          console.log(`Removing invalid email for ${company.name}: ${company.email}`);
          updateData.email = null;
          needsUpdate = true;
        }
      }
    }
    
    // Clean up phone - try to extract from malformed strings
    if (company.phone) {
      if (isValidPhone(company.phone)) {
        // Valid phone, keep it
      } else {
        // Try to extract valid phone from malformed string
        const extractedPhone = extractPhoneFromMalformed(company.phone);
        if (extractedPhone && extractedPhone !== company.phone) {
          console.log(`Extracted valid phone for ${company.name}: ${company.phone} -> ${extractedPhone}`);
          updateData.phone = extractedPhone;
          needsUpdate = true;
        } else {
          console.log(`Removing invalid phone for ${company.name}: ${company.phone}`);
          updateData.phone = null;
          needsUpdate = true;
        }
      }
    }
    
    // Clean up social media links
    if (company.linkedin && !socialPatterns.linkedin.test(company.linkedin)) {
      console.log(`Removing invalid LinkedIn for ${company.name}: ${company.linkedin}`);
      updateData.linkedin = null;
      needsUpdate = true;
    }
    
    if (company.twitter && !socialPatterns.twitter.test(company.twitter)) {
      console.log(`Removing invalid Twitter for ${company.name}: ${company.twitter}`);
      updateData.twitter = null;
      needsUpdate = true;
    }
    
    if (company.instagram && !socialPatterns.instagram.test(company.instagram)) {
      console.log(`Removing invalid Instagram for ${company.name}: ${company.instagram}`);
      updateData.instagram = null;
      needsUpdate = true;
    }
    
    // Check for malformed strings in email/phone that might contain social links
    const allFields = [company.email, company.phone, company.linkedin, company.twitter, company.instagram].join(' ');
    const extractedSocial = extractSocialFromMalformed(allFields);
    
    if (extractedSocial.linkedin && !company.linkedin) {
      console.log(`Extracted LinkedIn for ${company.name}: ${extractedSocial.linkedin}`);
      updateData.linkedin = extractedSocial.linkedin;
      needsUpdate = true;
    }
    
    if (extractedSocial.twitter && !company.twitter) {
      console.log(`Extracted Twitter for ${company.name}: ${extractedSocial.twitter}`);
      updateData.twitter = extractedSocial.twitter;
      needsUpdate = true;
    }
    
    if (extractedSocial.instagram && !company.instagram) {
      console.log(`Extracted Instagram for ${company.name}: ${extractedSocial.instagram}`);
      updateData.instagram = extractedSocial.instagram;
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
