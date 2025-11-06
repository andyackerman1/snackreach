# Add Clerk Key to Railway - Step by Step

Follow these exact steps to add your Clerk key to Railway.

---

## Step 1: Open Railway Dashboard

1. Open your web browser
2. Go to: **https://railway.app**
3. **Sign in** to your Railway account (or sign up if you don't have one)

---

## Step 2: Find Your Project

1. You should see a list of your projects
2. **Click on your project** (the one that has your SnackReach backend)
3. If you're not sure which one, look for "snackreach" or "snackconnect" in the name

---

## Step 3: Select Your Service

1. After clicking your project, you'll see your services
2. **Click on your backend service** (usually named something like "backend", "api", or "web")
3. This is the service that runs your `server.js` file

---

## Step 4: Open Variables Tab

1. At the top of the page, you'll see tabs like: **"Deployments"**, **"Variables"**, **"Settings"**, etc.
2. **Click on "Variables"** tab
3. This is where you add environment variables

---

## Step 5: Add New Variable

1. Look for a button that says **"+ New Variable"** or **"Add Variable"** or **"Add"**
2. **Click that button**
3. A form will appear with two fields:
   - **Variable Name** (or "Key")
   - **Value**

---

## Step 6: Enter the Variable Name

1. In the **"Variable Name"** field (or "Key" field), type exactly:
   ```
   CLERK_SECRET_KEY
   ```
2. Make sure it's exactly like that (all caps, with underscores)

---

## Step 7: Enter the Variable Value

1. In the **"Value"** field, paste this exactly:
   ```
   sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe
   ```
2. Make sure there are no extra spaces before or after

---

## Step 8: Save the Variable

1. **Click "Add"** or **"Save"** or **"Create"** button
2. The variable should now appear in your list

---

## Step 9: Wait for Redeploy

1. Railway will **automatically redeploy** your service
2. You'll see a message like "Redeploying..." or "Deploying..."
3. **Wait 1-2 minutes** for it to finish
4. You can watch the progress in the "Deployments" tab

---

## Step 10: Verify It's Working

After Railway finishes redeploying:

1. **Test the database status:**
   - Go to: `https://snackreach-production.up.railway.app/api/database-status`
   - Should show: `"databaseType": "Clerk"` ✅

2. **Test signup:**
   - Go to: `https://snackreach-production.up.railway.app/signup.html`
   - Create a test account
   - Should work!

3. **Check Clerk Dashboard:**
   - Go to: https://dashboard.clerk.com → Users
   - You should see your Railway user!

---

## Visual Guide

```
Railway Dashboard
    ↓
Your Project (click it)
    ↓
Your Service (click it)
    ↓
"Variables" Tab (click it)
    ↓
"+ New Variable" Button (click it)
    ↓
Variable Name: CLERK_SECRET_KEY
Value: sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe
    ↓
Click "Add" or "Save"
    ↓
Wait for redeploy (1-2 minutes)
    ↓
Done! ✅
```

---

## Troubleshooting

### Can't find "Variables" tab?
- Make sure you clicked on your **service**, not just the project
- Look for tabs at the top of the service page

### Can't find "+ New Variable" button?
- It might be at the top right
- Or it might say "Add Variable" or just "Add"
- Look for any button that says "New" or "Add"

### Variable not saving?
- Make sure Variable Name is exactly: `CLERK_SECRET_KEY`
- Make sure Value starts with: `sk_test_`
- Make sure there are no extra spaces

### Railway not redeploying?
- Sometimes it takes a moment
- Check the "Deployments" tab to see if it's deploying
- If not, you can manually trigger a redeploy

---

## That's It!

Once you add the variable and Railway redeploys, your Railway app will use Clerk! 🎉

---

## Quick Reference

**Variable Name:** `CLERK_SECRET_KEY`  
**Variable Value:** `sk_test_aLyrgzZK7cp8xSAyrhHCzxrPS5dfsYOVWN7Yi64OQe`

**Where to add it:** Railway Dashboard → Your Project → Your Service → Variables Tab


