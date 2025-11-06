# Authentication System - Quick Reference

## What System Should You Use?

**You already have a complete authentication system!** Here's what it includes:

## ✅ Your Current System

### 1. **User Registration & Login**
- Users can sign up with email/password
- Users can sign in securely
- Passwords are hashed (never stored in plain text)
- JWT tokens for session management

### 2. **User Data Storage**
- All user accounts stored in `backend/data/database.json`
- Permanent storage (survives server restarts)
- Each user has their own data:
  - Profile info (name, email, company, phone)
  - User type (startup/office)
  - Subscription info
  - Payment methods
  - Custom data fields

### 3. **Protected Routes**
- Users must be logged in to access certain features
- JWT token validates each request
- Users can only access their own data

## How It Works

```
User Signs Up
    ↓
Account Created → Saved to Database → JWT Token Generated
    ↓
User Signs In
    ↓
Token Validated → Access Granted → User Data Retrieved
    ↓
User Updates Profile
    ↓
Changes Saved → Database Updated → Response Sent
```

## Key Components

### Database
- **File:** `backend/data/database.json`
- **Format:** JSON with `users` array
- **Storage:** Permanent, all user accounts

### Authentication
- **Method:** JWT (JSON Web Tokens)
- **Security:** Password hashing with bcrypt
- **Session:** 10-year expiration (essentially permanent)

### API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/register` | POST | No | Create new account |
| `/api/login` | POST | No | Sign in |
| `/api/profile` | GET | Yes | Get user data |
| `/api/profile` | PUT | Yes | Update user data |
| `/api/account` | DELETE | Yes | Delete account |

## What You Can Store Per User

Each user account can store:
- ✅ Basic info (name, email, phone, company)
- ✅ User type (startup/office)
- ✅ Subscription details
- ✅ Payment methods
- ✅ Custom fields (easy to add)

## Adding Custom User Data

To store additional data per user:

1. **Update registration** (when user signs up):
```javascript
// In backend/server.js, registration endpoint
const newUser = {
  // ... existing fields
  customData: req.body.customData,
  preferences: req.body.preferences || {}
};
```

2. **Update profile endpoint** (when user updates):
```javascript
// In backend/server.js, PUT /api/profile
if (req.body.customData) {
  user.customData = req.body.customData;
}
```

3. **Frontend** (send data in forms):
```javascript
fetch('/api/register', {
  method: 'POST',
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    customData: 'any data you want'
  })
});
```

## System Architecture

```
┌─────────────┐
│   Frontend  │
│  (Browser)  │
└──────┬──────┘
       │
       │ HTTP Requests
       │ (with JWT token)
       ↓
┌─────────────┐
│   Backend   │
│  (Express)  │
└──────┬──────┘
       │
       │ authenticateToken()
       │ (validates JWT)
       ↓
┌─────────────┐
│  Database   │
│  (JSON)     │
│  users: []  │
└─────────────┘
```

## Security Features

1. **Password Hashing**
   - Passwords never stored in plain text
   - bcrypt with 10 salt rounds

2. **JWT Tokens**
   - Signed with secret key
   - Contains user ID (not password)
   - Validated on every protected request

3. **Protected Routes**
   - Only authenticated users can access
   - Users can only see their own data

## Database Persistence

### Local
- File: `backend/data/database.json`
- ✅ Persists across restarts
- ✅ All accounts saved

### Railway (Production)
- File: `/app/backend/data/database.json`
- ⚠️ Requires persistent volume
- See `RAILWAY-PERSISTENCE.md` for setup

## Summary

**You have everything you need:**

✅ User registration  
✅ User login  
✅ Secure password storage  
✅ JWT authentication  
✅ User data storage  
✅ Profile updates  
✅ Protected routes  
✅ Permanent storage  

**The system is ready to use!**

Users can:
- Sign up for accounts
- Sign in securely
- Store their own data
- Update their profiles
- Access protected features

All data is permanently stored in your database.

## Next Steps

1. **Ensure Railway persistence** (see `RAILWAY-PERSISTENCE.md`)
2. **Test the system:**
   - Create a test account
   - Sign in
   - Update profile
   - Verify data persists

3. **Frontend integration:**
   - Store JWT token in localStorage
   - Send token with requests
   - Handle authentication errors

For detailed documentation, see `USER-AUTHENTICATION-SYSTEM.md`.



