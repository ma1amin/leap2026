import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const CYBERSECURITY_KEYWORDS = [
  'cybersecurity',
  'security',
  'cyber',
  'threat',
  'protection',
  'firewall',
  'encryption',
  'penetration testing',
  'penetration',
  'SOC',
  'incident response',
  'malware',
  'phishing',
  'zero trust',
  'compliance',
  'vulnerability',
  'hacking',
  'hack',
  'defense',
  'secure',
  'authentication',
  'authorization',
  'identity',
  'access control',
  'network security',
  'information security',
  'infosec',
  'data protection',
  'privacy',
  'risk management',
  'security operations',
  'threat intelligence',
  'endpoint security',
  'cloud security',
  'application security',
  'devsecops',
];

interface Company {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  website?: string;
  booth?: string;
  hall?: string;
}

function isCybersecurityCompany(description: string): boolean {
  const lowerDesc = description.toLowerCase();
  return CYBERSECURITY_KEYWORDS.some(keyword => 
    lowerDesc.includes(keyword.toLowerCase())
  );
}

async function scrapeLeapDirectory(): Promise<Company[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Loading LEAP directory...');
  await page.goto('https://leap-directory-production.up.railway.app', {
    waitUntil: 'networkidle2',
  });

  // Wait for content to load
  await page.waitForSelector('body', { timeout: 10000 });

  const content = await page.content();
  await browser.close();

  const $ = cheerio.load(content);
  const companies: Company[] = [];

  // Parse the directory structure
  // The page has headers with company names followed by descriptions
  $('h3').each((index, element) => {
    const name = $(element).text().trim();
    
    // Get the description from the next sibling or following text
    let description = '';
    let descriptionAr = '';
    let website = '';
    
    const nextElement = $(element).next();
    if (nextElement.length > 0) {
      const text = nextElement.text();
      
      // Split Arabic and English descriptions
      const lines = text.split('\n').filter(line => line.trim());
      
      // First line is usually Arabic description
      if (lines.length > 0) {
        descriptionAr = lines[0].trim();
      }
      
      // Remaining lines are English description
      if (lines.length > 1) {
        description = lines.slice(1).join(' ').trim();
      }
      
      // Extract website links
      const links = nextElement.find('a');
      if (links.length > 0) {
        website = links.first().attr('href') || '';
      }
    }

    if (name && description) {
      companies.push({
        name,
        nameAr: name, // Assuming the displayed name is Arabic
        description,
        descriptionAr,
        website: website || undefined,
      });
    }
  });

  return companies;
}

function filterCybersecurityCompanies(companies: Company[]): Company[] {
  console.log(`Total companies found: ${companies.length}`);
  
  const cybersecurityCompanies = companies.filter(company => {
    const combinedText = `${company.name} ${company.description} ${company.descriptionAr || ''}`.toLowerCase();
    return CYBERSECURITY_KEYWORDS.some(keyword => 
      combinedText.includes(keyword.toLowerCase())
    );
  });

  console.log(`Cybersecurity companies found: ${cybersecurityCompanies.length}`);
  return cybersecurityCompanies;
}

async function main() {
  try {
    console.log('Starting LEAP directory scrape...');
    const companies = await scrapeLeapDirectory();
    
    const cybersecurityCompanies = filterCybersecurityCompanies(companies);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '..', 'data', 'companies.json');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(cybersecurityCompanies, null, 2));
    console.log(`Saved ${cybersecurityCompanies.length} cybersecurity companies to ${outputPath}`);
    
    // Print sample
    console.log('\nSample companies:');
    cybersecurityCompanies.slice(0, 5).forEach(company => {
      console.log(`- ${company.name}`);
      console.log(`  ${company.description.substring(0, 100)}...`);
      console.log(`  Website: ${company.website || 'N/A'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error scraping directory:', error);
    process.exit(1);
  }
}

main();
