# Setup Instructions

This guide will help you set up the LEAP 2026 Directory on your local machine.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ma1amin/leap2026.git
   cd leap2026
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   
   Generate Prisma client:
   ```bash
   npx prisma generate
   ```
   
   Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed the database**
   
   ```bash
   npx ts-node scripts/seed-database.ts
   ```

6. **(Optional) Enrich contact data**
   
   To scrape company websites for contact information:
   ```bash
   npx ts-node scripts/enrich-contacts.ts
   ```

   To clean up invalid contact data:
   ```bash
   npx ts-node scripts/cleanup-contacts.ts
   ```

## Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Dark Mode

The application supports dark mode with the following features:
- Toggle between light and dark themes using the theme button in the header
- Theme preference is saved to localStorage and persists across sessions
- Respects system preference on first visit
- Smooth transitions between themes
- All components are fully styled for both light and dark modes
- Built with Tailwind CSS v3 using class-based dark mode

**Configuration:**
- Dark mode is configured in `tailwind.config.ts` with `darkMode: 'class'`
- The `ThemeToggle` component adds/removes the `dark` class on the `html` element
- CSS transitions are applied in `globals.css` for smooth theme switching
- All components use `dark:` prefix for dark mode styling

### Production Mode

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Database Management

### View Database
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

### Create New Migration
```bash
npx prisma migrate dev --name migration_name
```

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

## Troubleshooting

### Database Issues

If you encounter database errors:
1. Delete the `dev.db` file
2. Run `npx prisma migrate reset`
3. Re-seed the database with `npx ts-node scripts/seed-database.ts`

### Module Not Found Errors

If you see module not found errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

If you encounter TypeScript errors:
```bash
npx prisma generate
```

## Development Workflow

1. Make changes to the code
2. Test locally with `npm run dev`
3. Commit changes with descriptive messages
4. Push to GitHub

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
