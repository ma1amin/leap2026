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

interface Individual {
  name: string;
  nameAr?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  bio?: string;
  bioAr?: string;
  category?: string;
  booth?: string;
  hall?: string;
}

function assignCategory(bio: string, title: string, company: string): string {
  const combinedText = `${bio} ${title} ${company}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (combinedText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  return 'other';
}

async function loadCookies(filePath: string): Promise<any[]> {
  try {
    const cookiesData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(cookiesData);
  } catch (error) {
    console.error('Error loading cookies:', error);
    return [];
  }
}

async function scrapeIndividuals(cookiesPath?: string, useProfile: boolean = false, profileName?: string): Promise<Individual[]> {
  const launchOptions: any = {
    headless: false, // Set to false for debugging
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
  };
  
  // Use Chrome user profile for authentication
  if (useProfile) {
    let userProfilePath: string;
    
    if (profileName) {
      // Use specific profile by name
      userProfilePath = 'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\User Data\\Profile ' + profileName;
      console.log(`Using Chrome profile: ${profileName}`);
    } else {
      // Use default profile or custom path from env
      userProfilePath = process.env.CHROME_USER_PROFILE || 'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\User Data';
      console.log(`Using Chrome profile: ${userProfilePath}`);
    }
    
    launchOptions.args.push(`--user-data-dir=${userProfilePath}`);
  }
  
  const browser = await puppeteer.launch(launchOptions);
  
  const page = await browser.newPage();
  
  // Set realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  // Set realistic viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Hide webdriver property
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
  });
  
  // Intercept network requests to capture API responses
  const apiResponses: any[] = [];
  page.on('response', async (response) => {
    const url = response.url();
    const contentType = response.headers()['content-type'] || '';
    
    // Capture all JSON responses
    if (contentType.includes('application/json')) {
      try {
        const data = await response.json();
        apiResponses.push({ url, data });
        console.log(`Captured JSON response from: ${url}`);
      } catch (e) {
        // Not valid JSON, ignore
      }
    }
  });
  
  // Load cookies if provided
  if (cookiesPath && fs.existsSync(cookiesPath)) {
    const cookies = await loadCookies(cookiesPath);
    if (cookies.length > 0) {
      await page.setCookie(...cookies);
      console.log(`Loaded ${cookies.length} cookies`);
    } else {
      console.log('No cookies loaded from file');
    }
  } else {
    console.log('No cookies file provided or file does not exist');
    console.log('Please provide cookies from Firefox:');
    console.log('1. Open Firefox and log into https://connect.onegiantleap.com/event/leap2026/people/RXZlbnRWaWV3XzIwNzA1NzI=');
    console.log('2. Open Developer Tools (F12) → Application/Storage → Cookies');
    console.log('3. Export cookies for connect.onegiantleap.com domain');
    console.log('4. Save as cookies.json in the project root');
  }
  
  console.log('Loading LEAP individuals page...');
  await page.goto('https://connect.onegiantleap.com/event/leap2026/people/RXZlbnRWaWV3XzIwNzA1NzI=', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  // Wait for content to load
  await page.waitForSelector('body', { timeout: 10000 });

  // Check if we're on a login page or error page
  const pageTitle = await page.title();
  console.log('Page title:', pageTitle);
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  if (bodyText.toLowerCase().includes('login') || bodyText.toLowerCase().includes('sign in') || pageTitle.includes('Client Challenge')) {
    console.log('Page requires login or is showing challenge.');
    console.log('Waiting for you to login in the browser...');
    console.log('Please login and press Enter in this terminal when done...');
    
    // Wait for user to press Enter
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
    
    console.log('Continuing after login...');
    
    // Wait for page to load after login
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  // Try scrolling to trigger lazy loading
  console.log('Scrolling to trigger data loading...');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  // Wait for potential lazy-loaded content
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Scroll back up
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  
  // Wait longer for dynamic content and API calls
  console.log('Waiting for data to load...');
  await new Promise(resolve => setTimeout(resolve, 10000));

  const content = await page.content();
  
  // Save HTML for debugging
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'individuals-page.html'), content);
  console.log('Saved HTML to data/individuals-page.html for debugging');
  
  // Save API responses for debugging
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'api-responses.json'), JSON.stringify(apiResponses, null, 2));
  console.log(`Saved ${apiResponses.length} API responses to data/api-responses.json`);
  
  await browser.close();

  const $ = cheerio.load(content);
  const individuals: Individual[] = [];

  // Try to find individual data in the page
  // This will need to be adjusted based on the actual page structure
  console.log('Analyzing page structure...');
  
  // Look for individual cards or list items
  $('.person-card, .attendee-card, .user-card, [class*="person"], [class*="attendee"]').each((index, element) => {
    const name = $(element).find('h3, h4, .name, [class*="name"]').first().text().trim();
    const title = $(element).find('.title, .job-title, [class*="title"]').first().text().trim();
    const company = $(element).find('.company, [class*="company"]').first().text().trim();
    const bio = $(element).find('.bio, .description, [class*="bio"]').first().text().trim();
    
    // Extract contact info
    const email = $(element).find('a[href^="mailto:"]').first().attr('href')?.replace('mailto:', '');
    const linkedin = $(element).find('a[href*="linkedin.com"]').first().attr('href');
    const twitter = $(element).find('a[href*="twitter.com"], a[href*="x.com"]').first().attr('href');
    const instagram = $(element).find('a[href*="instagram.com"]').first().attr('href');
    
    if (name) {
      const category = assignCategory(bio, title, company);
      individuals.push({
        name,
        nameAr: name,
        title: title || undefined,
        company: company || undefined,
        email: email || undefined,
        linkedin: linkedin || undefined,
        twitter: twitter || undefined,
        instagram: instagram || undefined,
        bio: bio || undefined,
        bioAr: bio || undefined,
        category,
      });
    }
  });

  // If no individuals found, try to extract from JavaScript variables
  if (individuals.length === 0) {
    console.log('No individuals found in HTML structure, trying JavaScript variables...');
    const scriptContent = $('body').html() || '';
    
    // Look for data arrays in JavaScript
    const dataMatches = scriptContent.match(/var\s+\w+\s*=\s*(\[[\s\S]*?\]);/g);
    
    if (dataMatches) {
      for (const match of dataMatches) {
        try {
          const jsonStr = match.match(/=\s*(\[[\s\S]*?\]);/)?.[1];
          if (jsonStr) {
            const data = JSON.parse(jsonStr);
            if (Array.isArray(data) && data.length > 0) {
              console.log(`Found potential data array with ${data.length} items`);
              // Process this data - structure will depend on actual format
              break;
            }
          }
        } catch (e) {
          // Continue to next match
        }
      }
    }
  }

  return individuals;
}

async function main() {
  console.log('Starting LEAP individuals scrape...');
  
  const useProfile = process.argv.includes('--use-profile');
  const profileIndex = process.argv.indexOf('--profile');
  const profileName = profileIndex !== -1 ? process.argv[profileIndex + 1] : undefined;
  const cookiesPath = path.join(__dirname, '..', 'cookies.json');
  
  if (useProfile) {
    console.log('Using Chrome user profile for authentication');
    console.log('Make sure you are logged into the LEAP site in Chrome');
    console.log('Close all Chrome windows before running this script');
    if (profileName) {
      console.log(`Using profile: ${profileName}`);
    }
  }
  
  const individuals = await scrapeIndividuals(cookiesPath, useProfile, profileName);
  
  console.log(`Found ${individuals.length} individuals`);
  
  // Display category breakdown
  const categoryCount: Record<string, number> = {};
  individuals.forEach(ind => {
    const cat = ind.category || 'uncategorized';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  
  console.log('\nCategory breakdown:');
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });
  
  // Print sample
  if (individuals.length > 0) {
    console.log('\nSample individuals:');
    individuals.slice(0, 5).forEach((individual: any) => {
      console.log(`- ${individual.name} (${individual.title || 'No title'})`);
      console.log(`  Company: ${individual.company || 'N/A'}`);
      console.log(`  Category: ${individual.category || 'other'}`);
      console.log('');
    });
  }
  
  // Save to JSON file
  const outputPath = path.join(__dirname, '..', 'data', 'individuals.json');
  fs.writeFileSync(outputPath, JSON.stringify(individuals, null, 2));
  console.log(`\nSaved ${individuals.length} individuals to ${outputPath}`);
}

main();
