# Nandana Tea Factory Website - Next.js

A modern Next.js e-commerce website for Nandana Tea Factory.

## Features

- Product catalog (Retail and Wholesale)
- Shopping cart functionality
- User authentication and profiles
- Contact and inquiry forms
- Admin panel for managing products and inquiries
- Responsive design

## Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB database

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
   - `DATABASE_URL` - MongoDB connection string
   - `NEXTAUTH_SECRET` - A random secret string for session management

3. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**
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

- Authentication uses cookie-based sessions
- File uploads are stored in `public/uploads/`
- The database uses MongoDB with Prisma ORM
- Images are stored in `public/images/` directory
