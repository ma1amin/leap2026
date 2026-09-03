# Deployment Guide

This guide covers deploying the LEAP 2026 Cybersecurity Directory to Railway.

## Prerequisites

- Railway account (https://railway.app)
- GitHub account
- Railway CLI (optional)

## Deployment via Railway

### 1. Connect GitHub Repository

1. Log in to Railway (https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub account
5. Select the `ma1amin/leap2026` repository

### 2. Configure Environment Variables

Add the following environment variables in Railway:

```
DATABASE_URL="file:./dev.db"
```

For production, you may want to use Railway's PostgreSQL service instead of SQLite. In that case:

1. Add a PostgreSQL service in Railway
2. Update the DATABASE_URL to use the Railway PostgreSQL connection string
3. Update `prisma/schema.prisma` to use `postgresql` instead of `sqlite`
4. Run migrations

### 3. Build Settings

Railway will automatically detect Next.js and configure the build settings. The default configuration should work:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 4. Deploy

Click "Deploy" to start the deployment process. Railway will:

1. Install dependencies
2. Build the application
3. Start the server
4. Provide a public URL

### 5. Database Setup (SQLite)

Since we're using SQLite for simplicity:

1. The database file will be created in the Railway filesystem
2. You'll need to seed the database manually after deployment
3. For production, consider using Railway's PostgreSQL service

### 6. Seed Database (Manual)

After deployment, you'll need to seed the database:

1. Access the Railway console for your project
2. Run the seed script:
   ```bash
   npx ts-node scripts/seed-database.ts
   ```

Alternatively, you can create a custom script that runs on startup.

## Alternative: Vercel Deployment

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
vercel
```

Follow the prompts to deploy to Vercel.

### 3. Environment Variables

Add the DATABASE_URL environment variable in Vercel dashboard.

## Production Considerations

### Database

For production, consider:

- Use Railway PostgreSQL instead of SQLite
- Set up automatic backups
- Configure connection pooling

### Security

- Add authentication for admin features
- Implement rate limiting on API endpoints
- Enable HTTPS (automatic on Railway/Vercel)
- Add CORS configuration if needed

### Performance

- Enable caching for API responses
- Optimize database queries
- Consider CDN for static assets
- Monitor performance with Railway metrics

### Monitoring

- Set up error tracking (e.g., Sentry)
- Configure uptime monitoring
- Set up alerts for failures

## Updating the Application

To update the deployed application:

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Railway will automatically redeploy on push to main branch

## Troubleshooting

### Build Failures

- Check the build logs in Railway
- Ensure all dependencies are in package.json
- Verify environment variables are set correctly

### Database Issues

- Verify DATABASE_URL is correct
- Check if migrations have been run
- Ensure database schema matches Prisma schema

### Runtime Errors

- Check application logs in Railway
- Verify API endpoints are working
- Test database connectivity

## Custom Domain

To use a custom domain:

1. Go to project settings in Railway
2. Add custom domain
3. Configure DNS records as instructed
4. Enable SSL (automatic on Railway)

## Scaling

Railway automatically scales based on traffic. For high-traffic scenarios:

- Consider upgrading to paid plan
- Configure horizontal scaling
- Add load balancing
- Implement caching strategies

## Cost

Railway offers a free tier for small projects. Check Railway pricing for details on:
- Free tier limits
- Paid plan features
- Database costs
- Bandwidth costs
