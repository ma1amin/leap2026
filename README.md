# LEAP 2026 Directory

A comprehensive directory platform for all 1,475 LEAP 2026 exhibition companies, featuring category classification, contact enrichment, and advanced export capabilities.

## Features

- **All Companies**: Complete directory of 1,475 LEAP 2026 companies with category classification
- **Category Filtering**: Filter by category (cybersecurity, AI, fintech, cloud, infrastructure, consulting, healthcare, education, retail, other)
- **Hall Filtering**: Filter by exhibition hall (H1, H2, H3, H4, H5, H1A)
- **Contact Enrichment**: Automated web scraping to extract email, phone, and social media details
- **Searchable Interface**: Real-time search and filter functionality
- **Multi-Select Export**: Select specific companies for export
- **Export Options**: Bulk export in CSV, Excel (XLSX), and JSON formats
- **Dashboard Statistics**: Real-time statistics showing company counts by category, websites, contact info, and social media
- **Modern UI**: Gradient header, skeleton loading states, responsive design
- **Bilingual Support**: Arabic and English company descriptions

## Tech Stack

- **Frontend**: Next.js 16 (React) with TypeScript, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: SQLite with Prisma ORM
- **Deployment**: Local development

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ma1amin/leap2026.git
cd leap2026
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev --name init
npx ts-node scripts/seed-database.ts
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Documentation

- [Setup Instructions](docs/SETUP.md) - Detailed setup guide
- [API Documentation](docs/API.md) - API endpoints and usage
- [Data Pipeline](docs/DATA_PIPELINE.md) - Scraping and enrichment process
- [Deployment Guide](docs/DEPLOYMENT.md) - Deployment instructions

## Project Structure

```
e:/leap/
├── docs/                 # Documentation
├── prisma/              # Database schema and migrations
├── scripts/             # Data scripts (scraping, seeding)
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── api/        # API routes
│   │   └── company/    # Company pages
│   ├── components/     # React components
│   └── lib/           # Utility functions
├── data/              # Static data files
└── package.json
```

## Development

### Database Management

View database:
```bash
npx prisma studio
```

Reset database:
```bash
npx prisma migrate reset
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT
