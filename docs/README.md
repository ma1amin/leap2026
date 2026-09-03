# LEAP 2026 Directory

A comprehensive directory platform for all 1,475 LEAP 2026 exhibition companies, featuring category classification, contact enrichment, and advanced export capabilities.

## Overview

This platform extracts all companies from the LEAP 2026 directory (1,475 companies), classifies them by category (cybersecurity, AI, fintech, cloud, infrastructure, consulting, healthcare, education, retail, other), enriches their data with contact information (email, phone, social media), and provides a searchable interface with export functionality.

## Features

- **All Companies**: Complete directory of 1,475 LEAP 2026 companies with category classification
- **Category Filtering**: Filter by category (cybersecurity, AI, fintech, cloud, infrastructure, consulting, healthcare, education, retail, other)
- **Hall Filtering**: Filter by exhibition hall (H1, H2, H3, H4, H5, H1A)
- **Contact Enrichment**: Automated web scraping to extract email, phone, and social media details using puppeteer-core
- **Searchable Interface**: Real-time search and filter functionality
- **Multi-Select Export**: Select specific companies for export
- **Pagination**: 20 companies per page with navigation controls
- **Export Options**: Bulk export in CSV, Excel (XLSX), and JSON formats with loading states
- **Dashboard Statistics**: Real-time statistics showing company counts by category, websites, contact info, and social media
- **Modern UI**: Gradient header, skeleton loading states, responsive design
- **Bilingual Support**: Arabic and English company descriptions

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
