# Migration Guide: Laravel to Next.js

This document outlines the conversion from Laravel to Next.js and key differences.

## Architecture Changes

### Backend
- **Laravel PHP** → **Next.js API Routes (TypeScript)**
- **Eloquent ORM** → **Prisma ORM**
- **Blade Templates** → **React Components**
- **Laravel Sessions** → **Cookie-based Sessions**

### Frontend
- **Server-side Blade rendering** → **React Server/Client Components**
- **PHP variables in templates** → **React state and props**
- **Laravel routes** → **Next.js App Router**

## Key File Mappings

### Routes
- `backend/routes/web.php` → `app/api/*/route.ts` (API routes) and `app/**/page.tsx` (pages)

### Controllers
- `backend/app/Http/Controllers/*.php` → `app/api/*/route.ts`

### Models
- `backend/app/Models/*.php` → `prisma/schema.prisma` (schema definition)

### Views
- `backend/resources/views/*.blade.php` → `app/**/page.tsx` and `app/components/*.tsx`

### Assets
- `backend/public/css/style.css` → `app/globals.css`
- `backend/public/images/*` → `public/images/*`
- `backend/public/js/*` → Integrated into React components

## Database Migration

### Option 1: Fresh Start
1. Run Prisma migrations:
   ```bash
   npx prisma db push
   ```

### Option 2: Migrate Existing Data
1. Export data from Laravel database
2. Import into SQLite/PostgreSQL
3. Update `DATABASE_URL` in `.env`

## Authentication Changes

### Laravel
- Uses Laravel's session management
- `session()->put('user_signup_id', $user->id)`
- Middleware: `['user.session']`

### Next.js
- Cookie-based sessions
- `createSession(user)` stores user data in cookies
- `requireAuth()` checks session in API routes
- Client-side: `fetch('/api/auth/session')`

## API Endpoints

All API endpoints maintain the same structure:
- `/api/auth/login` - POST
- `/api/auth/logout` - POST
- `/api/auth/session` - GET
- `/api/signup` - POST
- `/api/products` - GET, POST
- `/api/products/[slug]` - GET, PUT, DELETE
- `/api/cart` - GET, POST, DELETE
- `/api/cart/items/[itemId]` - PUT, DELETE
- `/api/contact` - POST
- `/api/wholesale/inquiry` - POST
- `/api/profile` - GET, POST
- `/api/profile/upload-avatar` - POST
- `/api/admin/*` - Admin operations

## Form Handling

### Laravel
```php
Route::post('/contact', [ContactController::class, 'store']);
```

### Next.js
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
}
```

## Environment Variables

### Laravel (.env)
```
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

### Next.js (.env)
```
DATABASE_URL="file:./database/database.sqlite"
NEXTAUTH_SECRET=your-secret-key
NODE_ENV=development
```

## File Uploads

### Laravel
- Uses Laravel Storage facade
- `Storage::disk('public')->put()`
- Files stored in `storage/app/public`

### Next.js
- Uses Node.js `fs` module
- Files stored in `public/uploads/`
- FormData handling in API routes

## Session Management

### Laravel
- Server-side sessions stored in database/files
- Automatic CSRF protection

### Next.js
- Cookie-based sessions
- CSRF protection via SameSite cookies
- Session data stored in cookies (consider using database sessions for production)

## Testing the Migration

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test key features:**
   - User registration and login
   - Product browsing
   - Add to cart
   - Profile management
   - Contact form submission

3. **Check database:**
   ```bash
   npx prisma studio
   ```

## Known Limitations

1. **Email functionality**: Email sending is not implemented (marked as TODO in code)
2. **Admin panel**: Basic admin routes exist but admin UI pages need to be created
3. **Payment integration**: Payment page is a placeholder
4. **Session storage**: Currently uses cookies; consider database sessions for production

## Next Steps

1. Set up email service (e.g., SendGrid, Resend)
2. Implement admin UI pages
3. Add payment gateway integration
4. Set up production database (PostgreSQL recommended)
5. Configure production environment variables
6. Set up CI/CD pipeline
7. Add error logging and monitoring

## Support

For issues or questions about the migration, refer to:
- Next.js documentation: https://nextjs.org/docs
- Prisma documentation: https://www.prisma.io/docs
- React documentation: https://react.dev
