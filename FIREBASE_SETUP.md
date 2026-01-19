# Firebase Setup Guide

## ✅ Completed Setup Steps

Your Next.js project is now configured to work with Firebase! Here's what has been set up:

### 1. **Environment Configuration**
- Created `.env.local` with all Firebase credentials
- Firebase config uses environment variables (`NEXT_PUBLIC_FIREBASE_*`)
- All sensitive data is properly configured through `.env.local`

### 2. **Firebase Initialization**
- Updated `lib/firebase.ts` to use environment variables
- Firebase services initialized: Authentication, Firestore, Storage, and Analytics
- Proper client-side Firebase setup with SSR/SSG compatibility

### 3. **API Routes Configured**
Your project uses Firebase in the following key areas:

#### Authentication Routes
- `app/api/auth/login/route.ts` - User login with Firestore
- `app/api/auth/logout/route.ts` - User logout
- `app/api/auth/session/route.ts` - Session management
- `app/api/signup/route.ts` - User registration

#### Data Management Routes
- `app/api/products/route.ts` - Product catalog (CRUD operations)
- `app/api/wholesale-products/route.ts` - Wholesale products
- `app/api/contact/route.ts` - Contact form submissions
- `app/api/admin/wholesale-inquiries/route.ts` - Admin wholesale inquiries
- `app/api/cart/route.ts` - Shopping cart management

#### File Storage Routes
- `app/api/admin/products/upload-image/route.ts` - Product image uploads
- `app/api/profile/upload-avatar/route.ts` - User avatar uploads

## 🚀 Running the Project

The development server is now running! You can access it at:
- **URL:** http://localhost:3000

## 📋 Firebase Collections Required

For the application to function properly, ensure these Firestore collections exist in your Firebase project:

### Collections to Create

1. **users**
   ```
   Fields: id, email, password, name, avatar, createdAt, updatedAt
   ```

2. **products**
   ```
   Fields: id, name, description, price, image, category, is_wholesale, stock, createdAt, updatedAt
   ```

3. **wholesale_products**
   ```
   Fields: id, name, description, price, image, category, minOrderQuantity, stock, createdAt, updatedAt
   ```

4. **inquiries**
   ```
   Fields: id, name, email, subject, message, status, createdAt, updatedAt
   ```

5. **wholesale_inquiries**
   ```
   Fields: id, companyName, email, phone, message, status, createdAt, updatedAt
   ```

6. **cart_items**
   ```
   Fields: id, userId, productId, quantity, price, createdAt, updatedAt
   ```

## 🔐 Security Rules (Firestore)

Set up appropriate Firestore security rules. Here's a basic configuration:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to products
    match /products/{document=**} {
      allow read;
      allow write: if request.auth.uid != null && isAdmin();
    }

    // Allow public read access to wholesale products
    match /wholesale_products/{document=**} {
      allow read;
      allow write: if request.auth.uid != null && isAdmin();
    }

    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.uid != null && isAdmin();
    }

    // Allow authenticated users to submit inquiries
    match /inquiries/{document=**} {
      allow read: if request.auth.uid != null && isAdmin();
      allow create;
    }

    // Allow authenticated users to submit wholesale inquiries
    match /wholesale_inquiries/{document=**} {
      allow read: if request.auth.uid != null && isAdmin();
      allow create;
    }

    // Cart items
    match /cart_items/{cartItem} {
      allow read, write: if request.auth.uid == request.resource.data.userId;
    }

    // Helper function to check admin status
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🌅 Storage Rules (Firebase Storage)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload their avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }

    // Allow authenticated users to manage product images
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && isAdmin();
    }

    function isAdmin() {
      return request.auth.token.admin == true;
    }
  }
}
```

## 🧪 Testing Firebase Connection

To verify Firebase is working:

1. Open your browser and navigate to http://localhost:3000
2. Try the contact form to test Firestore writes
3. Check your Firebase Console to see if inquiries are being stored
4. Test user signup/login functionality

## 📝 Environment Variables Reference

Your `.env.local` file contains:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBAk91MIoqSx6ti9Mf0RKMkX6My4P2nlzU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=nandanatea-3d398.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=nandanatea-3d398
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=nandanatea-3d398.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=518052125983
NEXT_PUBLIC_FIREBASE_APP_ID=1:518052125983:web:bdb9d7dbaabbfdf539a42a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XL77KKMFDK
```

**Note:** These are prefixed with `NEXT_PUBLIC_` which means they are accessible on the client side (standard for Firebase web apps).

## 🔗 Useful Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js + Firebase Guide](https://nextjs.org/learn/dashboard-app/setting-up-your-database)

## ⚙️ Next Steps

1. **Create Firestore Collections** - Use the Firebase Console to create the required collections
2. **Set up Security Rules** - Apply the Firestore and Storage security rules above
3. **Test API Routes** - Verify each API route works with your Firebase project
4. **Deploy** - When ready, deploy to Firebase Hosting or Vercel

## 🆘 Troubleshooting

### "Firebase config is missing..."
- Ensure `.env.local` exists in the project root
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set

### "Firestore database not initialized"
- Create a Firestore database in the Firebase Console
- Ensure database location matches your project region

### "Permission denied" errors
- Review and update your Firestore security rules
- Make sure user authentication is properly implemented

### "Storage bucket not found"
- Verify Cloud Storage is enabled in your Firebase project
- Check the bucket URL in `.env.local` matches your Firebase project
