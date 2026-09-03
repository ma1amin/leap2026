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
Due to Windows security policy blocking Puppeteer, we manually curated a list of cybersecurity companies based on the LEAP directory content.

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
- **Completed on 2025-01-07**
- Companies with known websites: 8/20
- Companies successfully enriched: 7/8 (SAFCSP website was unreachable)
- Companies requiring manual entry: 12/20

### Enrichment Results

#### Successfully Enriched Companies
- **Aikido Security** (https://aikido.dev)
  - LinkedIn: https://www.linkedin.com/company/aikido-security/
  - Twitter: https://twitter.com/AikidoSecurity

- **Algosec** (https://algosec.com)
  - LinkedIn: https://www.linkedin.com/company/algosec

- **CrowdStrike** (https://crowdstrike.com)
  - Phone: (888) 512-8906
  - LinkedIn: https://www.linkedin.com/company/crowdstrike
  - Instagram: https://www.instagram.com/crowdstrike/?hl=en

- **ESET Middle East** (https://eset.com)
  - Twitter: https://twitter.com/eset
  - LinkedIn: https://www.linkedin.com/company/esetnorthamerica
  - Instagram: https://www.instagram.com/eset

- **Sangfor Technologies Arabia limited** (https://sangfor.com)
  - LinkedIn: https://www.linkedin.com/company/sangfor-technologies
  - Twitter: https://twitter.com/SANGFOR
  - Instagram: https://www.instagram.com/sangfortechnologies/

- **Saudi Technology and Security Comprehensive Control Company Co. Ltd (Tahakom)** (https://tahakom.com.sa)
  - LinkedIn: https://www.linkedin.com/company/tahakom-group/
  - Twitter: https://twitter.com/tahakom_sa

- **ZainTECH** (https://zain.com)
  - Twitter: https://www.twitter.com/zain/
  - Instagram: https://www.instagram.com/zaingroup/
  - LinkedIn: https://www.linkedin.com/company/zain

#### Failed Enrichment
- **SAFCSP** (https://safcs.org.sa)
  - Error: DNS resolution failed (website unreachable)

### Companies Without Websites (Require Manual Entry)
- CyberAgora
- CyberFortX
- CyberLabs LLP
- D3Minds Cyber Solutions Pvt Ltd
- DIGISEC
- DSShield
- HookPhish
- Nucleon Security
- Octopus Cybersecurity
- QuantiCor Security
- Rased Tieck for cybersecurity Company
- ValueMentor Cyber Security Company

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

### `scripts/parse-leap-data.ts`
Creates the initial companies.json file with cybersecurity company data.

**Usage:**
```bash
npx ts-node scripts/parse-leap-data.ts
```

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
