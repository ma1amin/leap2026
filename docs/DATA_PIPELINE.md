# Data Pipeline Documentation

This document describes the data collection, filtering, and enrichment process for the LEAP 2026 Cybersecurity Directory.

## Overview

The data pipeline consists of three main stages:
1. **Data Collection**: Extracting companies from the LEAP 2026 directory
2. **Cybersecurity Filtering**: Identifying cybersecurity-related companies
3. **Contact Enrichment**: Extracting contact details from company websites

## Stage 1: Data Collection

### Source
- LEAP 2026 Directory: https://leap-directory-production.up.railway.app
- Total companies: 1475

### Method
Using puppeteer-core with native Chrome installation to avoid Windows security policy blocking. The script extracts company data from the JavaScript variable D in the LEAP directory page and also extracts websites from the HTML structure.

### Output
- `data/companies.json`: JSON file containing company data

### Data Structure
```typescript
interface Company {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
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

## Stage 2: Cybersecurity Filtering

### Keywords Used
The following keywords are used to identify cybersecurity companies:
- cybersecurity, security, cyber
- threat, protection, firewall, encryption
- penetration testing, SOC, incident response
- malware, phishing, zero trust, compliance
- vulnerability, hacking, defense, secure
- authentication, authorization, identity
- access control, network security
- information security, infosec
- data protection, privacy
- risk management, security operations
- threat intelligence, endpoint security
- cloud security, application security, devsecops

### Filtering Process
1. Company name and description are analyzed
2. Keyword matching identifies cybersecurity-related companies
3. Manual review of borderline cases

### Results
- Total companies analyzed: 1475
- Cybersecurity companies identified: 20

## Stage 3: Contact Enrichment

### Planned Method
For each cybersecurity company:
1. Extract website from existing data
2. Scrape company website for:
   - Contact page (email, phone)
   - About page (social media links)
   - Footer (contact details)
3. Use structured data extraction
4. Store all found contact information
5. Flag companies with missing data for manual entry

### Current Status
- **Total companies extracted**: 235 cybersecurity companies from LEAP 2026 directory (out of 1,475 total companies)
- **Companies with websites**: 586 (from all companies)
- **Companies enriched**: 235 (all cybersecurity companies with websites)
- **Companies requiring manual entry**: None (manual entry not available)

### Enrichment Results

All 235 cybersecurity companies have been processed for contact enrichment. Companies with valid websites were scraped for email, phone, and social media links. Invalid data was cleaned up automatically.

**Note**: Due to the large number of companies, individual enrichment results are not listed here. Use the application to view detailed contact information for each company.

## Database Schema

```prisma
model Company {
  id            String   @id @default(cuid())
  name          String
  nameAr        String?
  description   String
  descriptionAr String?
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
Scrapes the LEAP directory to extract all companies and filters cybersecurity companies.

**Usage:**
```bash
npx ts-node scripts/scrape-leap.ts
```

**Features:**
- Uses puppeteer-core with native Chrome installation
- Extracts company data from JavaScript variable D in the page
- Extracts websites from HTML structure
- Filters companies using cybersecurity keywords
- Outputs filtered companies to data/companies.json

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
