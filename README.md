# LEAP 2026 Cybersecurity Directory

A cybersecurity-focused directory platform based on the LEAP 2026 exhibition, featuring filtered company listings, full contact details, and export capabilities.

## Features

- **Cybersecurity Filtering**: AI-powered keyword matching to identify cybersecurity companies
- **Contact Enrichment**: Automated web scraping to extract email, phone, and social media details
- **Searchable Interface**: Real-time search and filter functionality
- **Export Options**: Single entry and bulk export in CSV, Excel (XLSX), and JSON formats
- **Bilingual Support**: Arabic and English company descriptions
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14 (React) with TypeScript, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: SQLite with Prisma ORM
- **Deployment**: Railway

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
