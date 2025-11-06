# Quick Email Setup - Step by Step

Follow these exact steps to enable confirmation emails on signup.

## Option 1: Gmail Setup (5 minutes)

### Step 1: Get Gmail App Password

1. **Open:** https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App passwords

2. **If you see "App passwords aren't available":**
   - You need to enable 2-Step Verification first
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification" → Enable it
   - Then come back to App passwords

3. **Generate App Password:**
   - Select "Mail" and "Other (Custom name)"
   - Type: `SnackReach`
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)
   - Remove spaces when copying: `abcdefghijklmnop`

### Step 2: Add to Railway

1. **Go to Railway:**
   - https://railway.app/
   - Sign in
   - Select your **SnackReach** project
   - Click on your **service** (backend service)

2. **Open Variables Tab:**
   - Click **Variables** tab (or Settings → Variables)

3. **Add Each Variable** (click "New Variable" for each):

   **Variable 1:**
   - Name: `EMAIL_SERVICE`
   - Value: `gmail`

   **Variable 2:**
   - Name: `EMAIL_USER`
   - Value: `your-email@gmail.com` (replace with YOUR Gmail)

   **Variable 3:**
   - Name: `EMAIL_PASSWORD`
   - Value: `abcdefghijklmnop` (paste the 16-char app password from Step 1)

   **Variable 4:**
   - Name: `EMAIL_FROM`
   - Value: `noreply@snackreach.com`

   **Variable 5:**
   - Name: `BASE_URL`
   - Value: `https://your-railway-domain.up.railway.app` (replace with YOUR Railway domain)

4. **Save:**
   - Railway auto-saves and redeploys
   - Wait for deployment to finish

### Step 3: Verify Setup

1. **Check Railway Logs:**
   - Railway Dashboard → Your Service → Logs
   - Look for: `✅ Email service configured successfully`

2. **Test Endpoint:**
   - Visit: `https://your-railway-domain.up.railway.app/api/email-status`
   - Should show: `"emailConfigured": true`

3. **Test Signup:**
   - Go to: `https://your-railway-domain.up.railway.app/signup.html`
   - Create account with your real email
   - Check inbox for welcome email

## Done! ✅

Once these variables are set, every new signup will automatically receive a confirmation email.

---

## Option 2: SendGrid Setup (For Production)

### Step 1: Create SendGrid Account

1. Go to: https://signup.sendgrid.com/
2. Sign up for free account
3. Verify your email

### Step 2: Create API Key

1. SendGrid Dashboard → Settings → API Keys
2. Click "Create API Key"
3. Name: `SnackReach`
4. Permissions: **Full Access**
5. Click "Create & View"
6. **Copy the API key** (you'll only see it once!)

### Step 3: Add to Railway

Add these variables to Railway:

```
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key-here
EMAIL_FROM=noreply@snackreach.com
BASE_URL=https://your-railway-domain.up.railway.app
```

**Important:** `EMAIL_USER` must be exactly `apikey` (not your email)

---

## Troubleshooting

### "Email service configured" not showing:

- ✅ Check variable names are EXACT (case-sensitive)
- ✅ Check `EMAIL_USER` and `EMAIL_PASSWORD` are set
- ✅ Restart Railway service after adding variables

### Emails not sending:

- ✅ Check Railway logs for error messages
- ✅ For Gmail: Make sure you're using App Password (16 chars)
- ✅ Check spam folder
- ✅ Test with `/api/email-status` endpoint

### "Authentication failed":

- ✅ Gmail: Re-generate app password
- ✅ SendGrid: Check API key is active
- ✅ Make sure no extra spaces in passwords

---

## Quick Reference

**Gmail Variables:**
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=16-char-app-password
EMAIL_FROM=noreply@snackreach.com
BASE_URL=https://your-domain.up.railway.app
```

**SendGrid Variables:**
```
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-api-key
EMAIL_FROM=noreply@snackreach.com
BASE_URL=https://your-domain.up.railway.app
```

That's it! Once set up, emails will send automatically on every signup.

