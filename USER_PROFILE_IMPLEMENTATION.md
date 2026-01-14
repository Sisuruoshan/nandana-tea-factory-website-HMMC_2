# User Profile & Avatar Implementation - Complete Guide

## Overview
Successfully implemented a complete user profile management system with avatar upload functionality, profile editing, and navbar integration.

## Features Implemented

### 1. **Avatar Upload & Storage**
- Users can upload profile pictures from their device
- Avatars are stored in `storage/app/public/avatars/` directory
- Accessible via `/storage/avatars/[filename]`
- Supports JPEG, PNG, JPG, GIF formats (max 5MB)
- Old avatars are automatically deleted when replaced

### 2. **User Profile Management**
- View user profile details at `/profile`
- Edit profile information at `/edit-profile`
- Update fields:
  - Full Name
  - Email
  - Phone Number
  - Address
  - Password (optional)
- Profile changes saved to database

### 3. **Navbar Avatar Display**
- Logged-in users see their avatar in the top-right navbar
- Circular avatar image (40x40px)
- Click avatar to open dropdown menu with options:
  - My Profile
  - Edit Profile
  - Logout
- Default user icon shown if no avatar uploaded

### 4. **User Authentication Integration**
- Uses session-based authentication
- User data stored in `user_signups` table
- Session key: `user_signup_id`
- Profile accessible only to logged-in users

---

## Files Modified/Created

### Backend - Database
**File:** `database/migrations/2026_01_12_000001_add_avatar_to_user_signups_table.php`
- Added `phone` column (nullable string)
- Added `address` column (nullable text)
- Added `avatar` column (nullable string) - stores relative file path
- Includes existence checks to prevent duplicate columns

### Backend - Models
**File:** `app/Models/UserSignup.php`
- Updated `$fillable` array to include:
  - `phone`
  - `address`
  - `avatar`
- Enables mass assignment for profile fields

### Backend - Controllers
**File:** `app/Http/Controllers/ProfileController.php`
- `show()` - Display user profile page
- `edit()` - Show edit profile form
- `getProfile()` - API endpoint to fetch user data (JSON)
- `update(Request $request)` - Update profile information with validation
- `uploadAvatar(Request $request)` - Handle avatar file upload
- `logout(Request $request)` - Clear session and logout user

**Validation Rules:**
```
name: required|string|max:255
email: required|email|unique (except own email)
phone: nullable|string|max:20
address: nullable|string
password: nullable|string|min:8|confirmed (if changing)
avatar: required|image|mimes:jpeg,png,jpg,gif|max:5120 (5MB)
```

### Backend - Routes
**File:** `routes/web.php`
- `GET /profile` - View profile (ProfileController@show)
- `GET /edit-profile` - Edit profile form (ProfileController@edit)
- `GET /api/profile` - Get profile data as JSON (ProfileController@getProfile)
- `POST /api/profile/update` - Update profile (ProfileController@update)
- `POST /api/profile/upload-avatar` - Upload avatar (ProfileController@uploadAvatar)
- `POST /logout` - Logout user (ProfileController@logout)

### Frontend - Layout
**File:** `resources/views/layouts/app.blade.php`
- Integrated user profile dropdown in header
- Displays user avatar if uploaded
- Dropdown menu with profile links
- Logout button in dropdown

### Frontend - Views
**File:** `resources/views/edit-profile.blade.php`
- Complete profile editing interface
- Avatar upload with preview
- Profile form fields (name, email, phone, address)
- Password change section with confirmation
- Form validation and error messaging
- Success feedback on profile update
- Redirects to `/profile` after successful update

### Frontend - Styles
**File:** `public/css/style.css`
Added styles for:
```css
.user-profile-dropdown - Container for avatar button and menu
.avatar-btn - Clickable avatar button (40x40px circular)
.avatar-image - Avatar image styling
.user-menu - Dropdown menu container
.user-menu.active - Show/hide state
.user-menu-item - Menu items (profile, edit, logout)
.logout-btn - Special styling for logout button
```

### Frontend - JavaScript
**File:** `public/js/main.js`
- `toggleUserMenu()` - Toggle dropdown visibility
- Click-outside handler to close menu
- Menu auto-closes when clicking outside dropdown

---

## Database Schema Changes

### `user_signups` Table
```sql
ALTER TABLE user_signups ADD COLUMN phone VARCHAR(191) NULL;
ALTER TABLE user_signups ADD COLUMN address LONGTEXT NULL;
ALTER TABLE user_signups ADD COLUMN avatar VARCHAR(191) NULL;
```

---

## How to Use

### For Users
1. **Login** at `/login`
2. **View Profile** - Click avatar in navbar → "My Profile"
3. **Edit Profile** - Click avatar in navbar → "Edit Profile"
4. **Upload Avatar** - Click "Change Profile Picture" button
5. **Update Information** - Fill in profile details and save
6. **Change Password** - Enter new password (leave blank to keep current)
7. **Logout** - Click avatar in navbar → "Logout"

### For Developers
```php
// Get current logged-in user
$userId = session()->get('user_signup_id');
$user = \App\Models\UserSignup::find($userId);

// Access user profile data
echo $user->name;
echo $user->email;
echo $user->phone;
echo $user->address;
echo $user->avatar; // Relative path like "avatars/filename.jpg"

// Get avatar URL
$avatarUrl = asset('storage/' . $user->avatar);
```

---

## API Endpoints

### GET `/api/profile`
**Returns current user profile data**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Tea Lane",
  "avatar": "avatars/filename.jpg",
  "created_at": "2026-01-10T10:30:00Z"
}
```

### POST `/api/profile/update`
**Update user profile**
```
Form Data:
- name: string
- email: string
- phone: string (optional)
- address: string (optional)
- password: string (optional)
- password_confirmation: string
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ...updated user data }
}
```

### POST `/api/profile/upload-avatar`
**Upload profile picture**
```
Form Data:
- avatar: file (image, max 5MB)
```

**Response:**
```json
{
  "message": "Avatar uploaded successfully",
  "avatar_url": "/storage/avatars/filename.jpg"
}
```

---

## File Storage

### Avatar Storage Location
```
storage/
└── app/
    └── public/
        └── avatars/
            ├── user1-avatar.jpg
            ├── user2-avatar.png
            └── ...
```

### Accessibility
- Avatars accessible via `/storage/avatars/[filename]`
- Public storage symlink must exist: `public/storage` → `storage/app/public`
- Create with: `php artisan storage:link`

---

## Security Features

1. **Authentication Check** - All profile endpoints require valid session
2. **File Validation** - Avatar upload validates file type and size
3. **Old File Cleanup** - Previous avatars deleted when replaced
4. **CSRF Protection** - All POST requests require CSRF token
5. **Email Uniqueness** - Email must be unique (except own email)
6. **Password Hashing** - Passwords hashed with bcrypt before storage
7. **Column Existence Checks** - Migration prevents duplicate columns

---

## Troubleshooting

### Avatar Not Displaying
1. Check storage symlink exists: `ls -l public/storage`
2. Create if missing: `php artisan storage:link`
3. Verify file exists in `storage/app/public/avatars/`
4. Check file permissions (755 for directories, 644 for files)

### Profile Update Failed
1. Verify user is logged in (check session)
2. Check form CSRF token is valid
3. Verify email is not taken by another user
4. Check Laravel logs: `storage/logs/laravel.log`

### Avatar Upload Not Working
1. Check file size (max 5MB)
2. Verify file format (JPEG, PNG, JPG, GIF only)
3. Check `storage/app/public/avatars/` permissions
4. Verify `php artisan storage:link` was executed

---

## Testing

### Test User Registration & Profile
1. Navigate to `/signup`
2. Create account with valid credentials
3. Login at `/login`
4. Click avatar in navbar
5. Select "Edit Profile"
6. Upload profile picture
7. Update profile information
8. Verify changes reflected in profile view

### Test Avatar Upload
1. Login as user without avatar
2. Go to edit profile
3. Click "Change Profile Picture"
4. Select image from device
5. Verify preview shows uploaded image
6. Verify avatar displays in navbar
7. Refresh page and confirm persistence

### Test Dropdown Menu
1. Login to account with avatar
2. Click avatar in navbar
3. Verify menu appears with options:
   - My Profile
   - Edit Profile
   - Logout
4. Click outside menu, verify it closes
5. Click option, verify navigation works

---

## Migration History

```bash
# Run migrations
php artisan migrate

# Migration status
php artisan migrate:status

# Rollback if needed
php artisan migrate:rollback --step=1
```

---

## Performance Notes

- Avatar uploads stored efficiently without resizing (optimization for future)
- Session-based auth suitable for small to medium traffic
- Consider caching profile data for high-traffic scenarios
- Avatar CDN integration possible for future optimization

---

## Future Enhancements

1. **Avatar Resizing** - Auto-resize avatars to optimal dimensions
2. **Image Compression** - Reduce file sizes without quality loss
3. **Avatar Cropping** - Allow users to crop avatars before upload
4. **Profile Pictures Gallery** - Show user's uploaded images
5. **Social Linking** - Connect social media profiles
6. **Two-Factor Authentication** - Add 2FA for security
7. **Profile Privacy Settings** - Control visibility of profile info
8. **Activity Log** - Track profile changes and logins

---

## Support

For issues or questions about the user profile system:
1. Check laravel.log for error details
2. Verify database migrations completed successfully
3. Ensure storage symlink exists and is readable
4. Review ProfileController for business logic
5. Check session configuration in config/session.php

---

## Summary

✅ Complete user profile system implemented
✅ Avatar upload and storage configured
✅ Navbar integration with dropdown menu
✅ Profile editing with validation
✅ Database migrations applied
✅ Security features enabled
✅ Routes and API endpoints created
✅ Frontend views and styling completed
✅ All dependencies properly configured

Users can now manage their profiles with avatar uploads and view their personalized experience in the navbar!
