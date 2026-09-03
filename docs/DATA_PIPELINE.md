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
- **Not yet implemented**
- Companies with known websites: 7/20
- Companies requiring enrichment: 13/20

### Companies with Websites
- Aikido Security: https://aikido.dev
- Algosec: https://algosec.com
- CrowdStrike: https://crowdstrike.com
- ESET Middle East: https://eset.com
- SAFCSP: https://safcs.org.sa
- Sangfor: https://sangfor.com
- Tahakom: https://tahakom.com.sa
- ZainTECH: https://zain.com

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

### `scripts/enrich-contacts.ts` (Planned)
Enriches company data with contact details from websites.

**Usage:**
```bash
npx ts-node scripts/enrich-contacts.ts
```

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
- Some companies may require manual data entry
- The pipeline is designed to be idempotent - can be rerun safely
- Missing contact data is flagged for manual review
