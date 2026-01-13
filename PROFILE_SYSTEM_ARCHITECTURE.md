# User Profile System - Architecture & Flow Diagrams

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    NANDANA TEA WEBSITE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  FRONTEND (Browser)                  BACKEND (Laravel)          │
│  ─────────────────────────          ──────────────────          │
│                                                                   │
│  Navigation Bar                      ProfileController           │
│  ├─ Logo                            ├─ show()                    │
│  ├─ Menu Links                      ├─ edit()                    │
│  └─ [👤 Avatar] ◄───────────────────┤─ getProfile()              │
│     └─ My Profile                   ├─ update()                  │
│     └─ Edit Profile                 ├─ uploadAvatar()            │
│     └─ Logout                       └─ logout()                  │
│                                                                   │
│  Edit Profile Page                  UserSignup Model             │
│  ├─ Avatar Upload ─────────────────► $fillable = [               │
│  ├─ Name Input                       'name', 'email',            │
│  ├─ Email Input                      'phone', 'address',         │
│  ├─ Phone Input                      'avatar'                    │
│  ├─ Address Input                   ]                            │
│  ├─ Password Fields                                              │
│  └─ Save Button                     Database                     │
│                                      (MySQL)                     │
│  Profile View Page                   ┌──────────────────┐        │
│  ├─ Avatar Display                   │ user_signups     │        │
│  ├─ Name                             ├──────────────────┤        │
│  ├─ Email                            │ id               │        │
│  ├─ Phone                            │ name             │        │
│  └─ Address                          │ email            │        │
│                                      │ password         │        │
│                                      │ phone ✅ NEW     │        │
│                                      │ address ✅ NEW   │        │
│                                      │ avatar ✅ NEW    │        │
│                                      │ created_at       │        │
│                                      │ updated_at       │        │
│                                      └──────────────────┘        │
│                                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                      File Storage                                │
│  ─────────────────────────────────────────────────────────────  │
│  storage/app/public/avatars/                                    │
│  ├─ user1-avatar-123.jpg                                        │
│  ├─ user2-avatar-456.png                                        │
│  └─ user3-avatar-789.gif                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Registration & Login Flow

```
START
  │
  ├─→ Click "Sign Up"
  │   │
  │   └─→ Fill Form
  │       ├─ Name
  │       ├─ Email
  │       └─ Password
  │
  ├─→ Click "Sign Up" Button
  │   │
  │   └─→ POST /signup
  │       │
  │       ├─→ Validate Input
  │       ├─→ Hash Password
  │       ├─→ Save to Database
  │       ├─→ Create Session
  │       └─→ Redirect to Home
  │
  ├─→ User Icon Appears in Navbar
  │   (with default icon - no avatar yet)
  │
  ├─→ Navigate to Edit Profile
  │   │
  │   ├─→ GET /edit-profile
  │   │   └─→ Check Session ✅
  │   │   └─→ Load Form
  │   │
  │   └─→ Upload Avatar
  │       ├─ Select File
  │       ├─ Preview Shows
  │       ├─ Click Save
  │       │
  │       └─→ POST /api/profile/upload-avatar
  │           ├─ Validate File (type, size)
  │           ├─ Delete Old Avatar (if exists)
  │           ├─ Save New Avatar to storage/
  │           ├─ Update Database
  │           └─ Return Success
  │
  ├─→ Avatar Displays in Navbar
  │
  └─→ User Session Active ✅
```

---

## 🖱️ User Interaction Flow - Navbar Avatar

```
Logged In User Views Navbar
         │
         ├─→ Avatar Icon Visible
         │   (40x40px circular)
         │
         ├─→ Click Avatar
         │   │
         │   └─→ toggleUserMenu() Called (JavaScript)
         │       │
         │       └─→ Display Dropdown Menu:
         │           ┌──────────────────────┐
         │           │ 👤 My Profile        │ ◄─ GET /profile
         │           │ ✏️ Edit Profile      │ ◄─ GET /edit-profile
         │           │ 🚪 Logout            │ ◄─ POST /logout
         │           └──────────────────────┘
         │
         └─→ Click Outside Menu
             │
             └─→ Menu Closes
                 (event listener triggers)
```

---

## 📝 Edit Profile Form Submission

```
User Opens Edit Profile
         │
         └─→ GET /edit-profile
             │
             ├─→ Check Session (user logged in?)
             ├─→ Load UserSignup from DB
             ├─→ Render Form with Current Values:
             │   ├─ Name field
             │   ├─ Email field
             │   ├─ Phone field
             │   ├─ Address field
             │   ├─ Avatar preview
             │   └─ Password fields
             │
             └─→ Form Displayed
                 │
                 ├─→ Upload Avatar (Optional)
                 │   ├─ Select File
                 │   ├─ Preview Updates
                 │   ├─ Background Upload
                 │   │   POST /api/profile/upload-avatar
                 │   │   ├─ Validate
                 │   │   ├─ Store File
                 │   │   └─ Update DB
                 │   │
                 │   └─→ Success Message
                 │
                 ├─→ Update Profile Fields
                 │   ├─ Edit Name
                 │   ├─ Edit Email
                 │   ├─ Edit Phone
                 │   ├─ Edit Address
                 │   └─ Edit Password (optional)
                 │
                 ├─→ Click "Save Changes"
                 │   │
                 │   └─→ Client-Side Validation
                 │       ├─ Check Required Fields
                 │       ├─ Validate Email Format
                 │       └─ Validate Password Match
                 │
                 ├─→ POST /api/profile/update
                 │   │
                 │   └─→ Server-Side Validation
                 │       ├─ Verify Session
                 │       ├─ Validate Input
                 │       ├─ Check Email Uniqueness
                 │       ├─ Hash Password (if changing)
                 │       ├─ Update Database
                 │       ├─ Update Session
                 │       └─ Return Success Response
                 │
                 ├─→ Show Success Message
                 │   │
                 │   └─→ Redirect to /profile
                 │
                 └─→ Profile Updated ✅
```

---

## 🔐 Authentication & Session Flow

```
┌────────────────────────────────────────────────────┐
│         SESSION-BASED AUTHENTICATION               │
└────────────────────────────────────────────────────┘

BROWSER                          SERVER
───────                          ──────

1. POST /login
   ├─ Email
   └─ Password
   │
   ├─→ Validate Credentials
   ├─→ Find User in Database
   ├─→ Verify Password Hash
   │
   ├─→ CREATE SESSION ✅
   │   session()->put('user_signup_id', $user->id)
   │   session()->put('user_signup_name', $user->name)
   │
   └─→ SET-COOKIE: PHPSESSID=abc123...
   
2. Browser Stores Cookie
   └─→ PHPSESSID=abc123...

3. Subsequent Requests
   GET /edit-profile
   ├─ Cookie: PHPSESSID=abc123...
   │
   ├─→ Server Reads Cookie
   ├─→ Loads Session Data
   ├─→ Extracts user_signup_id
   ├─→ Checks if Valid ✅
   │
   └─→ Allow Access to Protected Route

4. POST /logout
   └─→ session()->flush()
       (Clear all session data)
       Cookie Expires
       Redirect to Home
```

---

## 💾 Data Flow - Avatar Upload

```
File Selection
      │
      └─→ <input type="file" accept="image/*">
          │
          ├─→ File Reader API
          ├─→ Preview in <img> tag
          │
          └─→ Show Preview

Form Submission (Automatic)
      │
      └─→ FormData Object
          ├─ File: avatar.jpg
          └─ CSRF Token

POST /api/profile/upload-avatar
      │
      ├─→ Server Receives File
      │
      ├─→ VALIDATION
      │   ├─ Check Authentication
      │   ├─ Validate File Type
      │   │  └─ Must be: jpeg, png, jpg, gif
      │   ├─ Validate File Size
      │   │  └─ Must be ≤ 5MB
      │   └─ All Valid ✅
      │
      ├─→ PROCESS FILE
      │   ├─ Get Old Avatar Path
      │   ├─ Delete Old File (if exists)
      │   ├─ Generate Unique Filename
      │   ├─ Store in storage/app/public/avatars/
      │   └─ Save Path to Database
      │
      ├─→ UPDATE DATABASE
      │   UPDATE user_signups
      │   SET avatar = 'avatars/new-file.jpg'
      │   WHERE id = 1
      │
      └─→ RESPONSE
          ├─ Status: 200 OK
          ├─ Message: "Avatar uploaded successfully"
          └─ URL: /storage/avatars/new-file.jpg

Browser Response
      │
      ├─→ Update <img src="...">
      ├─→ Show Success Message
      └─→ Avatar Visible in Navbar
```

---

## 🛣️ Route Mapping

```
HTTP METHOD  │  ROUTE                      │  CONTROLLER METHOD  │  Purpose
─────────────┼─────────────────────────────┼────────────────────┼──────────────────
GET          │  /profile                   │  show()             │  View profile page
GET          │  /edit-profile              │  edit()             │  Edit profile form
GET          │  /api/profile               │  getProfile()       │  Get profile JSON
POST         │  /api/profile/update        │  update()           │  Update profile info
POST         │  /api/profile/upload-avatar │  uploadAvatar()     │  Upload avatar file
POST         │  /logout                    │  logout()           │  Logout user
```

---

## 📊 Database Query Flow

```
PROFILE VIEW
└─→ SELECT * FROM user_signups WHERE id = ?
    └─→ Returns: name, email, phone, address, avatar, ...

PROFILE EDIT
└─→ SELECT * FROM user_signups WHERE id = ?
    └─→ Returns: all user data for form population

PROFILE UPDATE
├─→ SELECT * FROM user_signups WHERE email = ? (check uniqueness)
├─→ UPDATE user_signups SET name=?, email=?, phone=?, address=?, password=?
│   WHERE id = ?
└─→ Returns: success/failure response

AVATAR UPLOAD
├─→ UPDATE user_signups SET avatar = ? WHERE id = ?
└─→ Returns: avatar URL and success message
```

---

## 🎯 Validation Layer

```
CLIENT-SIDE (JavaScript - edit-profile.blade.php)
────────────────────────────────────────────────
├─ Required field checks
├─ Email format validation
├─ Password match confirmation
├─ Form field value validation
└─ Instant error messages

                    ↓

SERVER-SIDE (Laravel - ProfileController)
──────────────────────────────────────────
├─ Session/Authentication check
├─ Input validation (Validator)
│  ├─ name: required|string|max:255
│  ├─ email: required|email|unique
│  ├─ phone: nullable|string|max:20
│  ├─ address: nullable|string
│  └─ password: nullable|min:8|confirmed
├─ File validation (for avatar)
│  ├─ image (is_image)
│  ├─ mimes: jpeg, png, jpg, gif
│  └─ max: 5120 (5MB)
├─ Business logic validation
│  ├─ Email unique check (except own email)
│  └─ Password confirmation match
└─ Database constraints check
   └─ Foreign keys, etc.

                    ↓

SUCCESS
└─→ Data saved to database
    Cookies/Sessions updated
    Success response returned
```

---

## 🔗 Component Integration Map

```
                     ┌─────────────────────────┐
                     │   app.blade.php         │
                     │   (Main Layout)         │
                     └────────────┬────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
          ┌─────────▼────────┐      ┌──────────▼──────────┐
          │  Navigation Bar  │      │   Main Content     │
          │  (User Dropdown) │      │   (Current View)   │
          │                  │      │                    │
          │  Avatar Button ◄─┼──┐   │  - Home            │
          │  Dropdown Menu   │  │   │  - Products        │
          │  - My Profile    │  │   │  - Edit Profile ◄──┼──┐
          │  - Edit Profile  │  │   │  - Profile         │  │
          │  - Logout        │  │   │                    │  │
          │                  │  │   │                    │  │
          └──────────────────┘  │   └────────────────────┘  │
                                │                            │
                    ┌───────────┴────────────────┬───────────┘
                    │                            │
          ┌─────────▼──────────────┐  ┌─────────▼──────────────┐
          │ ProfileController      │  │ edit-profile.blade.php │
          │                        │  │                        │
          │ Methods:              │  │ Form Elements:         │
          │ - show()              │  │ - Avatar Upload        │
          │ - edit()              │  │ - Name Field           │
          │ - getProfile()        │  │ - Email Field          │
          │ - update()            │  │ - Phone Field          │
          │ - uploadAvatar()      │  │ - Address Field        │
          │ - logout()            │  │ - Password Fields      │
          │                        │  │ - Submit Button        │
          └────────────┬──────────┘  └────────────┬──────────┘
                       │                          │
                       └──────────────┬───────────┘
                                      │
                         ┌────────────▼───────────┐
                         │  UserSignup Model     │
                         │                       │
                         │  Attributes:          │
                         │  - name               │
                         │  - email              │
                         │  - password           │
                         │  - phone (NEW)        │
                         │  - address (NEW)      │
                         │  - avatar (NEW)       │
                         │                       │
                         └────────────┬──────────┘
                                      │
                         ┌────────────▼───────────┐
                         │  MySQL Database       │
                         │  user_signups table   │
                         │                       │
                         │  - Stores user data   │
                         │  - Avatar file paths  │
                         │  - Hashed passwords   │
                         └───────────────────────┘
                         
                         ┌────────────────────────┐
                         │  File Storage          │
                         │  storage/app/public/   │
                         │  └─ avatars/           │
                         │     (Avatar files)    │
                         └────────────────────────┘
```

---

## ✅ Complete Feature Checklist

```
FEATURES IMPLEMENTED
═════════════════════════════════════════════════════

User Registration & Authentication
  ☑ User registration endpoint
  ☑ Login endpoint
  ☑ Session management
  ☑ Logout endpoint
  ☑ Password hashing (bcrypt)

Profile Management
  ☑ View profile page
  ☑ Edit profile form
  ☑ Name editing
  ☑ Email editing with uniqueness check
  ☑ Phone number field
  ☑ Address field
  ☑ Password change capability

Avatar Upload System
  ☑ File upload form
  ☑ File type validation
  ☑ File size validation (5MB max)
  ☑ Image preview before upload
  ☑ Automatic old file cleanup
  ☑ Avatar storage system
  ☑ Avatar display in navbar

Navbar Integration
  ☑ Avatar button display (40x40px)
  ☑ Default user icon (no avatar)
  ☑ Dropdown menu on click
  ☑ Profile quick link
  ☑ Edit profile quick link
  ☑ Logout button
  ☑ Click-outside menu close

Frontend Features
  ☑ Form validation (client-side)
  ☑ Error message display
  ☑ Success message display
  ☑ Loading indicators
  ☑ Responsive design
  ☑ Mobile-friendly interface
  ☑ Smooth animations

Backend Features
  ☑ Input validation (server-side)
  ☑ CSRF token protection
  ☑ Session protection
  ☑ Email uniqueness check
  ☑ Password confirmation
  ☑ Database transaction safety
  ☑ Proper error responses

Security Features
  ☑ Authentication check on all endpoints
  ☑ Session-based auth
  ☑ File type validation
  ☑ File size limits
  ☑ Column existence checks
  ☑ Password hashing
  ☑ CSRF protection

Database
  ☑ user_signups table extended
  ☑ Phone column added
  ☑ Address column added
  ☑ Avatar column added
  ☑ Migration created
  ☑ Rollback support
```

---

## 🎓 Key Concepts Used

```
LARAVEL CONCEPTS
════════════════════════════════════════════════════

✓ Controllers - ProfileController for request handling
✓ Models - UserSignup for data access
✓ Migrations - Database schema changes
✓ Routes - URL to controller mapping
✓ Sessions - User authentication state
✓ Validation - Input validation rules
✓ Storage - File upload & storage
✓ Blade - Template engine for views
✓ Request - HTTP request handling
✓ Response - HTTP response generation

JAVASCRIPT CONCEPTS
════════════════════════════════════════════════════

✓ DOM Manipulation - Update page elements
✓ Event Listeners - Click handlers
✓ FormData API - Handle file uploads
✓ Fetch API - Async HTTP requests
✓ File Reader API - Image previews
✓ LocalStorage - Temporary data
✓ Event Delegation - Bubbling events
✓ Async/Await - Promise handling

CSS CONCEPTS
════════════════════════════════════════════════════

✓ Flexbox - Layout positioning
✓ Grid - Responsive grids
✓ Animations - Smooth transitions
✓ Hover States - Interactive feedback
✓ Media Queries - Mobile responsiveness
✓ CSS Variables - Dynamic theming
✓ Border Radius - Circular elements
✓ Box Shadow - Depth & elevation
```

---

This architecture provides a solid foundation for user profile management with avatar uploads on your Nandana Tea website!
