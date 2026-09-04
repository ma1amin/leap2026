# Data Pipeline Documentation

This document describes the data collection, categorization, and enrichment process for the LEAP 2026 Directory.

## Overview

The data pipeline consists of three main stages:
1. **Data Collection**: Extracting all companies from the LEAP 2026 directory
2. **Category Classification**: Auto-assigning categories based on keyword matching
3. **Contact Enrichment**: Extracting contact details from company websites

## Stage 1: Data Collection

### Source
- LEAP 2026 Directory: https://leap-directory-production.up.railway.app
- Total companies: 1475

### Method
Using puppeteer-core with native Chrome installation to avoid Windows security policy blocking. The script extracts all company data from the JavaScript variable D in the LEAP directory page and also extracts websites from the HTML structure. Companies are automatically categorized based on keyword matching.

### Output
- `data/companies.json`: JSON file containing company data

### Data Structure
```typescript
interface Company {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category?: string;
  website?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  booth?: string;
  hall?: string;
}
```

## Stage 2: Category Classification

### Categories Used
The following categories are auto-assigned based on keyword matching:
- **Cybersecurity**: cybersecurity, security, cyber, threat, protection, firewall, encryption, penetration testing, SOC, incident response, malware, phishing, zero trust, compliance, vulnerability, hacking, defense, secure, authentication, authorization, identity, access control, network security, information security, infosec, data protection, privacy, risk management, security operations, threat intelligence, endpoint security, cloud security, application security, devsecops
- **AI**: ai, artificial intelligence, machine learning, ml, deep learning, nlp, natural language processing, computer vision, neural network, automation, robotics, chatbot, generative ai, llm
- **Fintech**: fintech, financial, payment, banking, finance, blockchain, crypto, cryptocurrency, digital wallet, transaction, insurance, investment, trading, wealth management
- **Cloud**: cloud, saas, paas, iaas, hosting, server, computing, storage, virtualization, kubernetes, docker, container
- **Infrastructure**: infrastructure, it, network, hardware, data center, datacenter, connectivity, telecom, telecommunications, fiber, 5g
- **Consulting**: consulting, consultancy, advisory, services, solutions, integration, implementation, digital transformation
- **Healthcare**: health, medical, healthcare, pharma, pharmaceutical, biotech, biotechnology, wellness, clinic, hospital
- **Education**: education, learning, training, university, school, college, edtech, e-learning, course, academy, institute
- **Retail**: retail, e-commerce, ecommerce, shopping, commerce, marketplace, store, shop, consumer
- **Other**: Any company not matching the above categories

### Classification Process
1. Company name and description are analyzed
2. Keyword matching identifies the most relevant category
3. If no keywords match, company is classified as "other"

### Results
- Total companies analyzed: 1,475
- AI: 437 companies
- Other: 535 companies
- Infrastructure: 178 companies
- Cybersecurity: 232 companies
- Fintech: 35 companies
- Consulting: 37 companies
- Cloud: 11 companies
- Healthcare: 5 companies
- Education: 4 companies
- Retail: 1 company

## Stage 3: Contact Enrichment

### Method
For each company with a website:
1. Extract website from existing data
2. Scrape company website for:
   - Contact page (email, phone)
   - About page (social media links)
   - Footer (contact details)
3. Use structured data extraction with Cheerio
4. Store all found contact information
5. Clean up invalid data automatically

### Current Status
- **Total companies extracted**: 1,475 companies from LEAP 2026 directory
- **Companies with websites**: 586
- **Companies enriched**: 586 (all companies with websites)
- **Companies requiring manual entry**: None (manual entry not available)

### Category Breakdown
- AI: 437 companies
- Other: 535 companies
- Infrastructure: 178 companies
- Cybersecurity: 232 companies
- Fintech: 35 companies
- Cloud: 11 companies
- Consulting: 37 companies
- Healthcare: 5 companies
- Education: 4 companies
- Retail: 1 company

### Enrichment Results

All 586 companies with websites have been processed for contact enrichment. Companies with valid websites were scraped for email, phone, and social media links. Invalid data was cleaned up automatically using the cleanup script, which removed invalid emails and phone numbers.

**Note**: Due to the large number of companies, individual enrichment results are not listed here. Use the application to view detailed contact information for each company.

## Database Schema

```prisma
model Company {
  id            String   @id @default(cuid())
  name          String
  nameAr        String?
  description   String
  descriptionAr String?
  category      String?
  website       String?
  email         String?
  phone         String?
  linkedin      String?
  twitter       String?
  instagram     String?
  booth         String?
  hall          String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

## Scripts

### `scripts/scrape-leap.ts`
Scrapes the LEAP directory to extract all companies and auto-assigns categories.

**Usage:**
```bash
npx ts-node scripts/scrape-leap.ts
```

**Features:**
- Uses puppeteer-core with native Chrome installation
- Extracts company data from JavaScript variable D in the page
- Extracts websites from HTML structure
- Auto-assigns categories based on keyword matching (cybersecurity, ai, fintech, cloud, infrastructure, consulting, healthcare, education, retail, other)
- Outputs all 1,475 companies to data/companies.json

### `scripts/seed-database.ts`
Seeds the database with company data from companies.json.

**Usage:**
```bash
npx ts-node scripts/seed-database.ts
```

### `scripts/enrich-contacts.ts`
Enriches company data with contact details from websites using puppeteer-core and Cheerio.

**Usage:**
```bash
npx ts-node scripts/enrich-contacts.ts
```

**Features:**
- Uses puppeteer-core with native Chrome installation to avoid Windows security blocking
- Scrapes company websites for email, phone, and social media links
- Uses regex patterns to extract contact information
- Handles rate limiting with 2-second delays between requests
- Updates database with enriched data

**Note:** This script uses puppeteer-core instead of puppeteer to avoid downloading bundled Chromium. It points to the native Chrome installation at `C:\Program Files\Google\Chrome\Application\chrome.exe`.

### `scripts/cleanup-contacts.ts`
Cleans up invalid contact data extracted during enrichment.

**Usage:**
```bash
npx ts-node scripts/cleanup-contacts.ts
```

**Features:**
- Validates email addresses using regex
- Validates phone numbers (7-15 digits)
- Removes false positives and invalid data
- Filters out common non-contact emails (test, noreply, etc.)

## Database Management

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Seed Database
```bash
npx ts-node scripts/seed-database.ts
```

### Reset Database
```bash
npx prisma migrate reset
```

### View Database
```bash
npx prisma studio
```

## Notes

- Contact enrichment success rate depends on website quality
- Companies without websites will not have contact data (manual entry not available)
- The pipeline is designed to be idempotent - can be rerun safely
- Missing contact data is not flagged for manual review
