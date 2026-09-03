import puppeteer from 'puppeteer-core';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
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

  // Extract data from the JavaScript variable D
  const scriptContent = $('body').html() || '';
  
  // Find the var D = [...] array
  const match = scriptContent.match(/var D=\[([\s\S]*?)\];/);
  
  if (match) {
    try {
      // Parse the JSON data
      const jsonStr = '[' + match[1] + ']';
      const data = JSON.parse(jsonStr);
      
      console.log(`Found ${data.length} companies in LEAP directory`);
      
      // Also extract websites from the HTML structure
      const websiteMap = new Map<string, string>();
      $('.c').each((index, element) => {
        const name = $(element).find('h3').text().trim();
        const websiteLink = $(element).find('.ft .w').first();
        if (websiteLink.length > 0) {
          const href = websiteLink.attr('href');
          if (href && href !== '#') {
            websiteMap.set(name, href);
          }
        }
      });
      
      console.log(`Found websites for ${websiteMap.size} companies`);
      
      // Convert to our Company format
      data.forEach((item: any) => {
        const name = item.n || '';
        const website = websiteMap.get(name) || item.w || undefined;
        companies.push({
          name,
          nameAr: name, // Using same name for both
          description: item.d || '',
          descriptionAr: item.a || '',
          website: website,
          booth: item.b || undefined,
          hall: item.h || undefined,
        });
      });
    } catch (error) {
      console.error('Error parsing JSON data:', error);
    }
  } else {
    console.error('Could not find company data in page');
  }

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
