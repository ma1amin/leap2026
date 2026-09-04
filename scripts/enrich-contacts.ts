import puppeteer from 'puppeteer-core';
import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

interface ContactData {
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
}

// Email regex pattern
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Phone regex patterns (international formats)
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

// Keywords that might indicate contact sections
const contactKeywords = ['contact', 'about', 'team', 'reach', 'connect', 'get in touch'];

async function extractContactData(html: string, url: string): Promise<ContactData> {
  const $ = cheerio.load(html);
  const data: ContactData = {};

  // Extract emails from the entire page
  const text = $('body').text();
  const emails = text.match(emailRegex);
  if (emails && emails.length > 0) {
    // Filter out common non-contact emails
    const filteredEmails = emails.filter(email => 
      !email.includes('example') && 
      !email.includes('test') &&
      !email.includes('noreply') &&
      !email.includes('no-reply') &&
      !email.includes('sentry') &&
      !email.includes('wixpress') &&
      !email.includes('.jpg') &&
      !email.includes('.png')
    );
    if (filteredEmails.length > 0) {
      data.email = filteredEmails[0];
    }
  }

  // Extract phone numbers
  for (const regex of phoneRegexes) {
    const phones = text.match(regex);
    if (phones && phones.length > 0) {
      const cleanedPhone = phones[0].trim();
      // Validate phone length
      const digitsOnly = cleanedPhone.replace(/\D/g, '');
      if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
        data.phone = cleanedPhone;
        break;
      }
    }
  }

  // Extract social media links from href attributes
  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (!href) return;

    // Check for LinkedIn
    if (!data.linkedin && socialPatterns.linkedin.test(href)) {
      data.linkedin = href.startsWith('http') ? href : `https://${href}`;
    }

    // Check for Twitter
    if (!data.twitter && socialPatterns.twitter.test(href)) {
      data.twitter = href.startsWith('http') ? href : `https://${href}`;
    }

    // Check for Instagram
    if (!data.instagram && socialPatterns.instagram.test(href)) {
      data.instagram = href.startsWith('http') ? href : `https://${href}`;
    }
  });

  // Look for contact sections specifically
  contactKeywords.forEach(keyword => {
    const contactSection = $(`*:contains("${keyword}")`).parent();
    if (contactSection.length > 0) {
      const sectionText = contactSection.text();
      
      // Try to extract email from contact section if not found yet
      if (!data.email) {
        const sectionEmails = sectionText.match(emailRegex);
        if (sectionEmails && sectionEmails.length > 0) {
          const validEmail = sectionEmails.find(e => 
            !e.includes('example') && 
            !e.includes('test') &&
            !e.includes('noreply')
          );
          if (validEmail) data.email = validEmail;
        }
      }
      
      // Try to extract phone from contact section if not found yet
      if (!data.phone) {
        for (const regex of phoneRegexes) {
          const sectionPhones = sectionText.match(regex);
          if (sectionPhones && sectionPhones.length > 0) {
            const cleanedPhone = sectionPhones[0].trim();
            const digitsOnly = cleanedPhone.replace(/\D/g, '');
            if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
              data.phone = cleanedPhone;
              break;
            }
          }
        }
      }
    }
  });

  return data;
}

async function scrapeWebsite(url: string): Promise<ContactData> {
  console.log(`Scraping ${url}...`);
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid blocking
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Get page HTML
    const html = await page.content();
    
    // Extract contact data
    const contactData = await extractContactData(html, url);
    
    console.log(`Found data for ${url}:`, contactData);
    
    return contactData;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return {};
  } finally {
    await browser.close();
  }
}

async function enrichCompanyContacts() {
  console.log('Starting contact enrichment...');
  
  // Get all companies with websites
  const companies = await prisma.company.findMany({
    where: {
      website: {
        not: null,
      },
    },
  });

  console.log(`Found ${companies.length} companies with websites to enrich`);

  let processedCount = 0;
  let skippedCount = 0;
  let updatedCount = 0;

  for (const company of companies) {
    if (!company.website) continue;

    // Skip if company already has contact data
    if (company.email || company.phone || company.linkedin || company.twitter || company.instagram) {
      skippedCount++;
      continue;
    }

    try {
      const contactData = await scrapeWebsite(company.website);

      // Update company with enriched data (only if new data is valid)
      const updateData: any = {};
      
      if (contactData.email && !company.email) {
        updateData.email = contactData.email;
      }
      if (contactData.phone && !company.phone) {
        updateData.phone = contactData.phone;
      }
      if (contactData.linkedin && !company.linkedin) {
        updateData.linkedin = contactData.linkedin;
      }
      if (contactData.twitter && !company.twitter) {
        updateData.twitter = contactData.twitter;
      }
      if (contactData.instagram && !company.instagram) {
        updateData.instagram = contactData.instagram;
      }
      
      if (Object.keys(updateData).length > 0) {
        await prisma.company.update({
          where: { id: company.id },
          data: updateData,
        });
        console.log(`Updated ${company.name} with contact data`);
        updatedCount++;
      }
      
      processedCount++;
      console.log(`Progress: ${processedCount} processed, ${skippedCount} skipped, ${updatedCount} updated`);
      
      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to enrich ${company.name}:`, error);
      processedCount++;
    }
  }

  console.log(`Contact enrichment completed. Processed: ${processedCount}, Skipped: ${skippedCount}, Updated: ${updatedCount}`);
}

async function main() {
  try {
    await enrichCompanyContacts();
  } catch (error) {
    console.error('Error during enrichment:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
