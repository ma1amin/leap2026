# Deployment Guide

This guide covers deploying the LEAP 2026 Directory.

## Note

This application is currently designed for local development only. Railway deployment is not required.

## Local Development Deployment

### Running Locally

The application runs locally using Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

To build for production:

```bash
npm run build
npm start
```

## Future Deployment Options

If you want to deploy to a cloud platform in the future, consider:

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add DATABASE_URL environment variable in Vercel dashboard

### Railway Deployment (Optional)

If you choose to deploy to Railway:

1. Connect GitHub repository to Railway
2. Configure DATABASE_URL environment variable
3. For production, consider using Railway PostgreSQL instead of SQLite
4. Update Prisma schema to use PostgreSQL
5. Run migrations and seed database

## Production Considerations

### Database

For production deployment, consider:
- Use PostgreSQL instead of SQLite
- Set up automatic backups
- Configure connection pooling

### Security

- Add authentication for admin features
- Implement rate limiting on API endpoints
- Enable HTTPS (automatic on Vercel/Railway)
- Add CORS configuration if needed

### Performance

- Enable caching for API responses
- Optimize database queries
- Consider CDN for static assets
- Monitor performance metrics
