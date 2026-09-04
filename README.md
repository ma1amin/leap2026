<div align="center">

# 🌟 LEAP 2026 Directory

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

**A comprehensive directory platform for 1,475 LEAP 2026 exhibition companies with intelligent categorization and advanced export capabilities**

[![Demo](https://img.shields.io/badge/demo-live-orange.svg)](http://localhost:3000)
[![Documentation](https://img.shields.io/badge/docs-view-purple.svg)](./docs/SETUP.md)

</div>

---

## 📋 Overview

<div align="center">

![🏢](https://animated-fluent-emoji.vercel.app/animated/Office-building-md.gif)

</div>

This platform extracts all companies from the LEAP 2026 directory, automatically classifies them into 10 categories using intelligent keyword matching, enriches their data with contact information, and provides a modern, searchable interface with powerful export capabilities.

### 🎯 Key Highlights

- 📊 **1,475 Companies** - Complete directory with full coverage
- 🏷️ **10 Categories** - AI, Cybersecurity, Fintech, Cloud, Infrastructure, Consulting, Healthcare, Education, Retail, Other
- 📧 **Contact Enrichment** - Automated extraction of emails, phones, and social media
- 🔍 **Advanced Filtering** - Filter by category, hall, and real-time search
- 📤 **Flexible Export** - CSV, Excel, JSON with multi-select support
- 🎨 **Modern UI** - Gradient design, skeleton loading, responsive layout
- 🌐 **Bilingual** - Arabic and English company descriptions

---

## ✨ Features

### 🎨 User Interface
- **Modern Gradient Header** - Beautiful blue-purple-pink gradient design
- **Dashboard Statistics** - Real-time metrics with interactive charts
- **Pie Chart** - Visual category breakdown with percentages and animations
- **Bar Chart** - Hall distribution visualization with animations
- **Skeleton Loading** - Smooth loading states for better UX
- **Toast Notifications** - Feedback for user actions
- **Responsive Design** - Mobile-friendly with optimized breakpoints
- **Color-Coded Badges** - Visual category and hall indicators
- **Company Logos** - Gradient logo placeholders with initials
- **Dark Mode** - Toggle between light and dark themes with smooth transitions
- **Sticky Header** - Navigation controls always visible while scrolling with glassmorphism
- **Smooth Animations** - Fade-in, scale-in, and hover effects throughout
- **Enhanced Typography** - Improved spacing and font weights
- **Glassmorphism Effects** - Backdrop blur and semi-transparent backgrounds

### 🔍 Search & Filter
- **Real-time Search** - Instant filtering by name and description
- **Category Filter** - Filter by 10 predefined categories
- **Hall Filter** - Filter by exhibition halls (H1, H2, H3, H4, H5, H1A)
- **Multi-Select** - Select multiple companies for batch operations
- **Keyboard Shortcuts** - Ctrl+F for search, Arrow keys for pagination, Escape to clear filters

### 📤 Export Options
- **CSV Export** - Standard CSV format with all fields
- **Excel Export** - XLSX format with proper formatting
- **JSON Export** - Structured JSON for developers
- **Selected Export** - Export only selected companies
- **Category Export** - Export by specific category
- **Hall Export** - Export by specific hall
- **Loading States** - Visual feedback during export

### 📊 Dashboard Statistics
- **Total Companies** - Overall count display
- **Category Breakdown** - Interactive pie chart with percentages
- **Hall Distribution** - Bar chart showing companies per hall
- **Website Coverage** - Percentage of companies with websites
- **Contact Info** - Email and phone availability stats
- **Social Media** - LinkedIn, Twitter, Instagram coverage

---

## 🏗️ Architecture

<div align="center">

![🏗️](https://animated-fluent-emoji.vercel.app/animated/Construction-md.gif)

</div>

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js 14  │  │  React 18   │  │  TailwindCSS │      │
│  │  TypeScript  │  │  Components │  │  Styling    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /api/companies│  │ /api/export │  │  /api/stats  │      │
│  │  CRUD Ops    │  │  CSV/XLSX/JSON│  │  Statistics  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Prisma    │  │   SQLite    │  │  Puppeteer   │      │
│  │    ORM      │  │  Database   │  │  Scraper     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

<div align="center">

![⚙️](https://animated-fluent-emoji.vercel.app/animated/Gear-md.gif)

</div>

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| ![Next.js](https://img.shields.io/badge/Next.js-14-black) | 14 | React framework with App Router |
| ![React](https://img.shields.io/badge/React-18-blue) | 18 | UI library |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) | 5.0 | Type safety |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC) | 3.x | Utility-first CSS |
| ![Lucide](https://img.shields.io/badge/Lucide-icons-orange) | Latest | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-18-green) | 18+ | Runtime environment |
| ![Prisma](https://img.shields.io/badge/Prisma-5-2D3748) | 5.x | ORM for database |
| ![SQLite](https://img.shields.io/badge/SQLite-3-003B57) | 3.x | Embedded database |
| ![Puppeteer](https://img.shields.io/badge/Puppeteer-core-red) | Latest | Web scraping |

### Development Tools
| Technology | Purpose |
|------------|---------|
| ![ESLint](https://img.shields.io/badge/ESLint-linting-purple) | Code linting |
| ![Prettier](https://img.shields.io/badge/Prettier-formatting-pink) | Code formatting |
| ![Git](https://img.shields.io/badge/Git-version_control-orange) | Version control |

---

## 📁 Project Structure

```
leap2026/
├── 📂 docs/                    # Documentation
│   ├── SETUP.md               # Setup instructions
│   ├── API.md                 # API documentation
│   ├── DATA_PIPELINE.md       # Data collection process
│   └── DEPLOYMENT.md          # Deployment guide
├── 📂 src/
│   ├── 📂 app/
│   │   ├── page.tsx           # Main company listing
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── 📂 company/[id]/   # Company detail pages
│   │   └── 📂 api/            # API routes
│   │       ├── companies/     # Company CRUD
│   │       ├── export/        # Export endpoints
│   │       └── stats/         # Statistics
│   ├── 📂 components/         # React components
│   │   ├── CompanyTable.tsx   # Company table
│   │   ├── SearchBar.tsx      # Search input
│   │   ├── ExportButton.tsx   # Export buttons
│   │   ├── DashboardStats.tsx # Statistics dashboard
│   │   └── Toast.tsx          # Toast notifications
│   └── 📂 lib/
│       └── db.ts              # Prisma client
├── 📂 prisma/
│   ├── schema.prisma          # Database schema
│   └── 📂 migrations/         # Database migrations
├── 📂 scripts/
│   ├── scrape-leap.ts         # Data scraping
│   ├── enrich-contacts.ts    # Contact enrichment
│   ├── seed-database.ts      # Database seeding
│   └── cleanup-contacts.ts   # Data cleanup
├── 📂 data/
│   └── companies.json         # Raw company data
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

---

## 🚀 Getting Started

### Prerequisites

- ![Node.js](https://img.shields.io/badge/Node.js-18+-green) Node.js 18 or higher
- ![npm](https://img.shields.io/badge/npm-9+-red) npm 9 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ma1amin/leap2026.git
   cd leap2026
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Seed the database**
   ```bash
   npx ts-node scripts/seed-database.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

For detailed setup instructions, see [SETUP.md](./docs/SETUP.md).

---

## 📊 Data Pipeline

<div align="center">

![🔄](https://animated-fluent-emoji.vercel.app/animated/Antenna-bars-md.gif)

</div>

### Data Collection Process

1. **Scraping** - Extract all 1,475 companies from LEAP directory
2. **Classification** - Auto-assign categories using keyword matching
3. **Enrichment** - Scrape websites for contact information
4. **Cleanup** - Remove invalid data automatically
5. **Seeding** - Populate database with clean data

### Category Breakdown

| Category | Count | Percentage |
|----------|-------|------------|
| 🤖 AI | 437 | 29.6% |
| 📦 Other | 535 | 36.3% |
| 🏗️ Infrastructure | 178 | 12.1% |
| 🔒 Cybersecurity | 232 | 15.7% |
| 💰 Fintech | 35 | 2.4% |
| ☁️ Cloud | 11 | 0.7% |
| 🤝 Consulting | 37 | 2.5% |
| 🏥 Healthcare | 5 | 0.3% |
| 📚 Education | 4 | 0.3% |
| 🛒 Retail | 1 | 0.1% |

For detailed pipeline information, see [DATA_PIPELINE.md](./docs/DATA_PIPELINE.md).

---

## 🔌 API Documentation

### Main Endpoints

- **GET /api/companies** - List all companies with filtering
- **GET /api/companies/:id** - Get single company details
- **GET /api/export/csv** - Export as CSV
- **GET /api/export/excel** - Export as Excel
- **GET /api/export/json** - Export as JSON
- **GET /api/stats** - Get dashboard statistics

### Example Usage

```typescript
// Fetch companies with filters
const response = await fetch('/api/companies?category=ai&hall=H1&page=1&limit=20');
const data = await response.json();

// Export selected companies
window.open('/api/export/csv?ids=company1,company2,company3');
```

For complete API documentation, see [API.md](./docs/API.md).

---

## 🎯 Usage Examples

### Filtering Companies

```typescript
// Filter by category
<select onChange={(e) => setCategoryFilter(e.target.value)}>
  <option value="ai">AI Companies</option>
  <option value="cybersecurity">Cybersecurity</option>
</select>

// Filter by hall
<select onChange={(e) => setHallFilter(e.target.value)}>
  <option value="H1">Hall 1</option>
  <option value="H2">Hall 2</option>
</select>
```

### Exporting Data

```typescript
// Export all companies
<ExportButton format="csv" label="Export All CSV" />

// Export selected companies
<button onClick={() => exportSelected(selectedIds)}>
  Export Selected ({selectedIds.size})
</button>
```

---

## 🛡️ Security Considerations

- 🔒 No sensitive data exposed in client-side code
- 🔒 Database credentials managed via environment variables
- 🔒 Input validation on all API endpoints
- 🔒 Rate limiting recommended for production
- 🔒 HTTPS recommended for production deployment

---

## 🚧 Future Enhancements

### Planned Features
- 📊 Advanced charts for statistics (Recharts integration)
- 🗺️ Interactive hall map for booth locations
- 🔔 Real-time notifications for updates
- 🌙 Dark mode toggle
- ⌨️ Keyboard shortcuts
- 📱 PWA support for offline access
- 🔍 Advanced search with filters panel
- 📋 Export templates and scheduling

### Performance Improvements
- ⚡ Redis caching for API responses
- ⚡ Cursor-based pagination
- ⚡ Image optimization with CDN
- ⚡ Lazy loading for large datasets

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

<div align="center">

**Built with ❤️ for the LEAP 2026 Exhibition**

![🎉](https://animated-fluent-emoji.vercel.app/animated/Party-popper-md.gif)

</div>
