# Railway Step-by-Step Guide - Find Your URL & View Accounts

Follow these exact steps to find your Railway URL and view stored accounts.

## Part 1: Find Your Railway Service URL

### Step 1: Open Your Railway Project
- You're already here: https://railway.com/project/a63c66b1-5f99-4666-b587-ebb4bed65600
- You should see your project dashboard

### Step 2: Find Your Service
Look on the page for a **service** (it might be called):
- "snackreach-backend"
- "backend"
- "api"
- Or your project name

**What it looks like:**
- It's usually a card/box with a name
- It might have a status indicator (green = running, red = stopped)
- Click on it to open it

### Step 3: Click on the Service
- Click anywhere on the service card/box
- This opens the service details page

### Step 4: Find Your Domain
Once you're on the service page, look for **"Settings"** or **"Domains"**:

**Option A: Settings Tab**
1. Look for a **"Settings"** button or tab (usually at the top)
2. Click **"Settings"**
3. Look for **"Domains"** section
4. You'll see a URL like: `xxxxx.up.railway.app`

**Option B: Service Overview**
1. On the service page, look for a section showing the deployed URL
2. It might say "Domain" or "Public URL"
3. Copy that URL

**Option C: Deployments Tab**
1. Click **"Deployments"** tab
2. Click on the latest deployment
3. Look for the deployed URL in the details

### Step 5: Copy Your Domain
Your domain will look like one of these:
- `snackreach-production.up.railway.app`
- `your-app-name.up.railway.app`
- `random-words.up.railway.app`

**Copy this entire URL** - you'll need it in the next step!

---

## Part 2: Test Your Endpoint

### Step 1: Open a New Browser Tab
- Keep Railway open in one tab
- Open a new tab

### Step 2: Type This URL (Replace with YOUR domain)
In the address bar, type:
```
https://YOUR-DOMAIN-HERE.up.railway.app/api/database-status
```

**Example:** If your domain is `snackreach-production.up.railway.app`, you'd type:
```
https://snackreach-production.up.railway.app/api/database-status
```

### Step 3: Press Enter
- Press Enter or click Go
- You should see a page with JSON data

### Step 4: What You Should See
If it works, you'll see something like:
```json
{
  "databasePath": "/app/backend/data/database.json",
  "totalAccounts": 1,
  "accounts": [
    {
      "id": "123",
      "email": "user@example.com",
      "userType": "startup"
    }
  ]
}
```

---

## Part 3: If It Doesn't Work

### Try These URLs Instead:

**1. Health Check (Simpler test):**
```
https://YOUR-DOMAIN.up.railway.app/api/health
```
Should show: `{"status":"ok","message":"SnackReach API is running"}`

**2. Root Page (Test if server is running):**
```
https://YOUR-DOMAIN.up.railway.app/
```
Should show your website homepage

**3. Admin Dashboard:**
```
https://YOUR-DOMAIN.up.railway.app/admin-dashboard.html
```
Should show the admin login page

---

## Part 4: Check Service Status on Railway

### If None of the URLs Work:

1. **Go back to Railway** (your project page)
2. **Click on your service**
3. **Check the Status:**
   - Is it **green** (running) or **red** (stopped)?
   - If red/stopped, click the **play button** or **"Deploy"** to start it

4. **Check Deployments:**
   - Click **"Deployments"** tab
   - Is there a recent deployment?
   - Is it **successful** (green checkmark) or **failed** (red X)?
   - If failed, click on it to see error messages

5. **Check Logs:**
   - Click **"Logs"** tab
   - Look for errors (red text)
   - Look for: `✅ Server started on port 8080`

---

## Part 5: View Accounts via Admin Dashboard

### If the API endpoint doesn't work, use this instead:

1. **Go to Admin Dashboard:**
   ```
   https://YOUR-DOMAIN.up.railway.app/admin-dashboard.html
   ```

2. **Log In:**
   - Email: `snackreach1@gmail.com`
   - Password: `Greylock21`

3. **View Accounts:**
   - After logging in, click **"All Accounts"** tab
   - You'll see all stored accounts in a table

---

## Quick Checklist

☐ Found my service in Railway
☐ Clicked on the service
☐ Found Settings → Domains
☐ Copied my domain (xxxxx.up.railway.app)
☐ Tried: `https://MY-DOMAIN.up.railway.app/api/database-status`
☐ Checked if service is running (green status)
☐ Checked deployments (is there a successful one?)

---

## Still Stuck?

Share with me:
1. **What you see** when you click on your service in Railway
   - Is there a Settings button?
   - Is there a Domains section?
   - What tabs/buttons do you see?

2. **What happens** when you visit the URL
   - Does the page load?
   - What error message do you see?
   - Or does it just say "loading" forever?

3. **Service status**
   - Is it green (running) or red (stopped)?
   - Are there any deployments shown?

---

## Alternative: Tell Me What You See

If you're stuck, describe what you see on your Railway page:

**Example:**
- "I see a card that says 'backend'"
- "I see a Settings button"
- "I see a green dot that says 'Active'"
- "I see a domain that says 'snackreach-production.up.railway.app'"

This will help me guide you to the exact right place!

---

## Quick Reference: Your Railway Project

**Your Project URL:**
https://railway.com/project/a63c66b1-5f99-4666-b587-ebb4bed65600

**What to do:**
1. Find your service (click on it)
2. Find Settings → Domains
3. Copy the domain
4. Use it in: `https://YOUR-DOMAIN.up.railway.app/api/database-status`

That's it! 🚀



