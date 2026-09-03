import puppeteer from 'puppeteer';
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
      !email.includes('no-reply')
    );
    if (filteredEmails.length > 0) {
      data.email = filteredEmails[0];
    }
  }

  // Extract phone numbers
  for (const regex of phoneRegexes) {
    const phones = text.match(regex);
    if (phones && phones.length > 0) {
      data.phone = phones[0].trim();
      break;
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

  return data;
}

async function scrapeWebsite(url: string): Promise<ContactData> {
  console.log(`Scraping ${url}...`);
  
  const browser = await puppeteer.launch({
    headless: true,
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

  for (const company of companies) {
    if (!company.website) continue;

    try {
      const contactData = await scrapeWebsite(company.website);

      // Update company with enriched data
      await prisma.company.update({
        where: { id: company.id },
        data: {
          email: contactData.email || company.email,
          phone: contactData.phone || company.phone,
          linkedin: contactData.linkedin || company.linkedin,
          twitter: contactData.twitter || company.twitter,
          instagram: contactData.instagram || company.instagram,
        },
      });

      console.log(`Updated ${company.name} with contact data`);
      
      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to enrich ${company.name}:`, error);
    }
  }

  console.log('Contact enrichment completed');
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
