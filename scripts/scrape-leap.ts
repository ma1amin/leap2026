import puppeteer from 'puppeteer-core';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORY_KEYWORDS = {
  cybersecurity: [
    'cybersecurity', 'security', 'cyber', 'threat', 'protection', 'firewall',
    'encryption', 'penetration testing', 'penetration', 'SOC', 'incident response',
    'malware', 'phishing', 'zero trust', 'compliance', 'vulnerability',
    'hacking', 'hack', 'defense', 'secure', 'authentication', 'authorization',
    'identity', 'access control', 'network security', 'information security',
    'infosec', 'data protection', 'privacy', 'risk management', 'security operations',
    'threat intelligence', 'endpoint security', 'cloud security', 'application security',
    'devsecops',
  ],
  ai: [
    'ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning',
    'nlp', 'natural language processing', 'computer vision', 'neural network',
    'automation', 'robotics', 'chatbot', 'generative ai', 'llm',
  ],
  fintech: [
    'fintech', 'financial', 'payment', 'banking', 'finance', 'blockchain',
    'crypto', 'cryptocurrency', 'digital wallet', 'transaction', 'insurance',
    'investment', 'trading', 'wealth management',
  ],
  cloud: [
    'cloud', 'saas', 'paas', 'iaas', 'hosting', 'server', 'computing',
    'storage', 'virtualization', 'kubernetes', 'docker', 'container',
  ],
  infrastructure: [
    'infrastructure', 'it', 'network', 'hardware', 'data center', 'datacenter',
    'connectivity', 'telecom', 'telecommunications', 'fiber', '5g',
  ],
  consulting: [
    'consulting', 'consultancy', 'advisory', 'services', 'solutions',
    'integration', 'implementation', 'digital transformation',
  ],
  healthcare: [
    'health', 'medical', 'healthcare', 'pharma', 'pharmaceutical',
    'biotech', 'biotechnology', 'wellness', 'clinic', 'hospital',
  ],
  education: [
    'education', 'learning', 'training', 'university', 'school', 'college',
    'edtech', 'e-learning', 'course', 'academy', 'institute',
  ],
  retail: [
    'retail', 'e-commerce', 'ecommerce', 'shopping', 'commerce', 'marketplace',
    'store', 'shop', 'consumer',
  ],
};

interface Company {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category?: string;
  website?: string;
  booth?: string;
  hall?: string;
}

function assignCategory(description: string, name: string): string {
  const combinedText = `${name} ${description}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  return 'other';
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
        const description = item.d || '';
        const website = websiteMap.get(name) || item.w || undefined;
        const category = assignCategory(description, name);
        companies.push({
          name,
          nameAr: name, // Using same name for both
          description,
          descriptionAr: item.a || '',
          category,
          website: website === '' ? undefined : website,
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

async function main() {
  try {
    console.log('Starting LEAP directory scrape...');
    const companies = await scrapeLeapDirectory();
    
    // Count by category
    const categoryCounts: Record<string, number> = {};
    companies.forEach(company => {
      const cat = company.category || 'other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    console.log('\nCategory breakdown:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '..', 'data', 'companies.json');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(companies, null, 2));
    console.log(`\nSaved ${companies.length} companies to ${outputPath}`);
    
    // Print sample
    console.log('\nSample companies:');
    companies.slice(0, 5).forEach(company => {
      console.log(`- ${company.name} (${company.category})`);
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
