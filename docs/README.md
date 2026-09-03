# LEAP 2026 Cybersecurity Directory

A cybersecurity-focused directory platform based on the LEAP 2026 exhibition, featuring filtered company listings, full contact details, and export capabilities.

## Overview

This platform extracts and filters cybersecurity companies from the LEAP 2026 directory (1475 companies), enriches their data with contact information (email, phone, social media), and provides a searchable interface with export functionality.

## Features

- **Cybersecurity Filtering**: AI-powered keyword matching to identify cybersecurity companies
- **Contact Enrichment**: Automated web scraping to extract email, phone, and social media details
- **Searchable Interface**: Real-time search and filter functionality
- **Export Options**: Single entry and bulk export in CSV, Excel (XLSX), and JSON formats
- **Bilingual Support**: Arabic and English company descriptions
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Frontend
- Next.js 14 (React) with TypeScript
- TailwindCSS for styling
- shadcn/ui for UI components
- Lucide for icons

### Backend
- Node.js with Next.js API routes
- PostgreSQL database with Prisma ORM
- Puppeteer/Playwright for web scraping

### Deployment
- Local development only (Railway deployment not required)

## Project Structure

```
e:/leap/
├── docs/
│   ├── README.md (project overview)
│   ├── SETUP.md (setup instructions)
│   ├── API.md (API documentation)
│   ├── DATA_PIPELINE.md (scraping & enrichment process)
│   └── DEPLOYMENT.md (deployment guide)
├── src/
│   ├── app/
│   │   ├── page.tsx (company listing)
│   │   ├── company/[id]/page.tsx (detail view)
│   │   └── api/ (API routes)
│   ├── components/
│   │   ├── CompanyCard.tsx
│   │   ├── CompanyTable.tsx
│   │   ├── ExportButton.tsx
│   │   └── SearchBar.tsx
│   ├── lib/
│   │   ├── db.ts (Prisma client)
│   │   └── scraper.ts (web scraping)
│   └── types/
├── prisma/
│   └── schema.prisma
├── scripts/
│   ├── scrape-leap.ts (initial data)
│   └── enrich-contacts.ts (contact scraping)
└── package.json
```

## Getting Started

See [SETUP.md](./SETUP.md) for installation and setup instructions.

## API Documentation

See [API.md](./API.md) for API endpoints and usage.

## Data Pipeline

See [DATA_PIPELINE.md](./DATA_PIPELINE.md) for scraping and enrichment process details.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## License

MIT
