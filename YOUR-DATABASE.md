# Your Database - Current Status

## Database Location

**File Path:** `backend/data/database.json`

**Full Path:** `/Users/andy.ackerman/snackconnect/backend/data/database.json`

## Current Database Contents

Your database currently contains **1 user account**:

```json
{
  "users": [
    {
      "id": "1762358273242",
      "name": "debbie",
      "email": "acks102@optonline.ney",
      "password": "$2a$10$yZOo0/KosI5/cOq6pKJt7.r7k2gFGSg8PtM0OF51pKbm4xF5SUX4G",
      "companyName": "debbie's",
      "phone": "5166251117",
      "userType": "startup",
      "cardInfo": {},
      "subscription": {
        "status": "active",
        "plan": "premium",
        "price": 2,
        "billingCycle": "monthly"
      },
      "paymentMethods": [],
      "createdAt": "2025-11-05T15:57:53.242Z"
    }
  ],
  "snackCompanies": [],
  "offices": [],
  "products": [],
  "orders": [],
  "messages": []
}
```

## Database File Size

- **File Size:** 629 bytes
- **Last Modified:** November 5, 2025
- **Location:** `backend/data/database.json`

## How to View Your Database

### Method 1: Direct File Access
```bash
cat backend/data/database.json
```

### Method 2: Via API (when server is running)
```bash
curl http://localhost:3000/api/database-status
```

### Method 3: In Code
```javascript
const fs = require('fs');
const db = JSON.parse(fs.readFileSync('backend/data/database.json'));
console.log('Users:', db.users);
```

## Authentication - You DON'T Need Supabase!

### ✅ Your Current Authentication System

**You have a complete authentication system built-in:**

1. **JWT Tokens** - Secure session management
2. **Password Hashing** - bcrypt (passwords never stored in plain text)
3. **Protected Routes** - `authenticateToken` middleware
4. **User Management** - Registration, login, profile updates

### How Authentication Works

```
User Signs Up
    ↓
Password Hashed (bcrypt) → Account Saved → JWT Token Generated
    ↓
User Signs In
    ↓
Password Verified → JWT Token Generated → Token Sent to User
    ↓
User Makes Request
    ↓
Token Validated → Request Processed → Response Sent
```

### No Supabase Needed!

| Feature | Your System | Supabase |
|---------|-------------|----------|
| Authentication | ✅ JWT | ✅ JWT |
| Password Security | ✅ bcrypt | ✅ bcrypt |
| User Storage | ✅ JSON file | ✅ PostgreSQL |
| Session Management | ✅ Built-in | ✅ Built-in |

**Your system does everything Supabase does for authentication!**

## Why You Might Think Nothing is Stored

### Local Database (Working)
- ✅ **File exists:** `backend/data/database.json`
- ✅ **Has data:** 1 user account stored
- ✅ **Persists:** File survives server restarts

### Railway Database (May Need Fix)
- ⚠️ **Ephemeral filesystem:** Railway deletes files on restart
- ⚠️ **Solution:** Add persistent volume mount
- ⚠️ **See:** `RAILWAY-PERSISTENCE.md` for setup

## Verify Storage is Working

### Test Steps:

1. **Check database file exists:**
   ```bash
   ls -la backend/data/database.json
   ```

2. **View current accounts:**
   ```bash
   cat backend/data/database.json
   ```

3. **Create test account:**
   - Sign up a new user
   - Check server logs for: `✅ VERIFIED: User account permanently saved`
   - Check database file again

4. **Check via API:**
   ```bash
   curl http://localhost:3000/api/database-status
   ```

## Database Structure

Your database stores:

```json
{
  "users": [],           // All user accounts
  "snackCompanies": [],  // Snack company profiles
  "offices": [],         // Office profiles
  "products": [],        // Product listings
  "orders": [],          // Order history
  "messages": []         // Messages between users
}
```

## Summary

✅ **Database Location:** `backend/data/database.json`  
✅ **Current Status:** 1 account stored  
✅ **Authentication:** Built-in JWT (no Supabase needed)  
✅ **Storage:** Permanent (survives restarts locally)  
⚠️ **Railway:** Needs volume mount for persistence  

**Your database is working!** The file exists and has data stored.

