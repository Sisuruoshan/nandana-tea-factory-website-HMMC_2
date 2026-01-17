# Nandana Tea Factory Website - Next.js

This is the Next.js version of the Nandana Tea Factory website.

## Features

- Product catalog (Retail and Wholesale)
- Shopping cart functionality
- User authentication and profiles
- Contact and inquiry forms
- Admin panel for managing products and inquiries
- Responsive design

## Prerequisites

- Node.js 18+ and npm/yarn
- SQLite database (or configure another database in `.env`)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL` - Database connection string (default: `file:./database/database.sqlite`)
   - `NEXTAUTH_SECRET` - A random secret string for session management

3. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Copy product images (if needed):**
   ```bash
   cp -r public/images public/
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `app/api/` - API routes (authentication, products, cart, etc.)
- `app/components/` - React components (Header, Footer)
- `lib/` - Utility functions (Prisma client, authentication)
- `prisma/` - Prisma schema and migrations
- `public/` - Static assets (images, uploads)

## API Routes

- `/api/auth/login` - User login
- `/api/auth/logout` - User logout
- `/api/auth/session` - Get current session
- `/api/signup` - User registration
- `/api/products` - Product CRUD operations
- `/api/cart` - Shopping cart operations
- `/api/contact` - Contact form submission
- `/api/wholesale/inquiry` - Wholesale inquiry submission
- `/api/profile` - User profile management
- `/api/admin/*` - Admin operations

## Database Migration

If you have existing data from another backend, export and import it into your configured database or use Prisma to recreate the schema.

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Notes

- Authentication uses cookie-based sessions (simplified implementation)
- File uploads are stored in `public/uploads/`
- The database uses SQLite by default (can be changed to PostgreSQL/MySQL)
-- Images should be placed in the `public/images/` directory

## Differences from Previous Version

-- Uses Next.js App Router
-- TypeScript-based code
-- Prisma ORM
-- Cookie-based sessions
- React Server Components and Client Components
- API routes use Next.js Route Handlers
