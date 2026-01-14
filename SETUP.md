# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `DATABASE_URL="file:./database/database.sqlite"`
   - `NEXTAUTH_SECRET` - Generate a random string

3. **Initialize database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Copy images (if not already done):**
   ```bash
   cp -r backend/public/images public/
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   Navigate to http://localhost:3000

## Database Management

View database:
```bash
npx prisma studio
```

Reset database:
```bash
npx prisma db push --force-reset
```

## Production Build

```bash
npm run build
npm start
```

## Troubleshooting

**Issue: Database not found**
- Run `npx prisma db push` to create the database

**Issue: Images not loading**
- Ensure images are copied to `public/images/`
- Check image paths in components

**Issue: Authentication not working**
- Check that cookies are enabled in browser
- Verify `NEXTAUTH_SECRET` is set in `.env`

**Issue: Prisma client errors**
- Run `npx prisma generate` to regenerate Prisma client
