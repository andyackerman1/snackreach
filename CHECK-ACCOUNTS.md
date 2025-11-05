# How to Check Why Accounts Aren't Showing

## The Problem

If a user signed up but isn't showing on your owner dashboard, it's usually because:

1. **Different Databases**: Local and Production have separate databases
   - Local database: `backend/data/database.json` (on your computer)
   - Production database: Railway's database (on their servers)

2. **User signed up on Production, but you're viewing Local**
   - If user signed up at: `https://snackreach-production.up.railway.app/signup.html`
   - Their account is saved to Railway's database
   - If you're viewing: `http://localhost:3000/owner-dashboard.html`
   - You're looking at your LOCAL database (which is empty)

3. **Authentication Issues**
   - Owner dashboard requires owner login token
   - If you're not logged in as owner, you won't see accounts

## Solution 1: View Production Dashboard

**To see accounts from the production site:**

1. Go to: `https://snackreach-production.up.railway.app/owner-login.html`
2. Log in with your owner credentials
3. Go to: `https://snackreach-production.up.railway.app/owner-dashboard.html`
4. You should see all accounts from production

## Solution 2: Check Which Database You're Viewing

**Check the browser console (F12) to see:**
- Which API URL is being used
- How many accounts were loaded
- Any error messages

**Look for this in the console:**
```
API Base URL: https://snackreach-production.up.railway.app/api
Loading accounts from: https://snackreach-production.up.railway.app/api
Accounts loaded: X accounts
```

## Solution 3: Verify User Actually Signed Up

**Check if the signup actually worked:**

1. Check the production server logs on Railway
2. Check if the user received a confirmation
3. Verify the signup endpoint responded successfully

## Solution 4: Ensure Owner Dashboard Points to Production

**If viewing locally but want to see production accounts:**

The owner dashboard should automatically detect the environment, but you can verify:
- Open browser console (F12)
- Check what `window.API_BASE_URL` shows
- It should be `https://snackreach-production.up.railway.app/api` when viewing from production

## Quick Diagnostic Steps

1. **Open Owner Dashboard** (production or local)
2. **Open Browser Console** (F12)
3. **Click "All Accounts" tab**
4. **Look for console messages:**
   - `API Base URL: ...` - Shows which server you're connected to
   - `Loading accounts from: ...` - Confirms API endpoint
   - `Accounts loaded: X accounts` - Shows how many accounts were found
   - Any error messages - Will show what went wrong

5. **Check the response:**
   - If you see "Owner access required" - You're not logged in as owner
   - If you see "No accounts" - Database is empty or user didn't sign up
   - If you see account count - That's how many accounts exist

## Most Likely Issue

**The user signed up on production, but you're viewing the local dashboard.**

**Fix:** View the production dashboard at:
`https://snackreach-production.up.railway.app/owner-dashboard.html`

