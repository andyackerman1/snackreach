# Email Setup Guide - Send Confirmation Emails on Signup

This guide shows you how to configure email so users receive confirmation emails when they sign up.

## ✅ Email Functionality Already Built

Your backend already has email sending built in! When users sign up, it automatically:
1. Creates their account
2. Sends a welcome confirmation email
3. Logs the email status

## Step 1: Choose Email Service

You have 3 options:

### Option A: Gmail (Easiest for Testing)

**Pros:** Free, easy to set up  
**Cons:** Limited daily sending (500 emails/day)

### Option B: SendGrid (Recommended for Production)

**Pros:** 100 emails/day free, then paid  
**Cons:** Requires account setup

### Option C: Custom SMTP Server

**Pros:** Full control  
**Cons:** Requires your own email server

## Step 2: Get Email Credentials

### For Gmail:

1. **Go to Google Account Settings:**
   - https://myaccount.google.com/security
   - Sign in with your Gmail account

2. **Enable 2-Step Verification:**
   - Security → 2-Step Verification
   - Follow prompts to enable

3. **Generate App Password:**
   - Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "SnackReach"
   - Copy the 16-character password (you'll use this)

4. **You'll need:**
   - Your Gmail address (e.g., `yourname@gmail.com`)
   - The 16-character app password

### For SendGrid:

1. **Sign up for SendGrid:**
   - https://signup.sendgrid.com/
   - Create free account

2. **Create API Key:**
   - SendGrid Dashboard → Settings → API Keys
   - Create API Key
   - Give it "Full Access" permissions
   - Copy the API key

3. **You'll need:**
   - `apikey` (always use this)
   - Your SendGrid API key

## Step 3: Configure on Railway

### Add Environment Variables:

1. **Go to Railway Dashboard:**
   - https://railway.app/
   - Select your SnackReach project
   - Click on your backend service
   - Go to **Variables** tab

2. **Add These Variables:**

#### For Gmail:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_FROM=noreply@snackreach.com
BASE_URL=https://your-railway-domain.up.railway.app
```

#### For SendGrid:
```
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key-here
EMAIL_FROM=noreply@snackreach.com
BASE_URL=https://your-railway-domain.up.railway.app
```

#### For Custom SMTP:
```
EMAIL_SERVICE=smtp
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
SMTP_HOST=smtp.your-domain.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_FROM=noreply@snackreach.com
BASE_URL=https://your-railway-domain.up.railway.app
```

3. **Save Variables:**
   - Railway will auto-redeploy
   - Check deployment logs for email status

## Step 4: Verify Email Setup

### Check Railway Logs:

After adding variables, check Railway logs for:

```
✅ Email service configured successfully
```

If you see:
```
⚠️  Email not configured. Set EMAIL_USER and EMAIL_PASSWORD in .env
```
Then your variables aren't set correctly.

### Test Email Endpoint:

Visit in browser or use curl:
```
https://your-railway-domain.up.railway.app/api/email-status
```

Should return:
```json
{
  "emailConfigured": true,
  "hasTransporter": true,
  "emailService": "gmail",
  "hasEmailUser": true,
  "hasEmailPassword": true,
  "emailFrom": "noreply@snackreach.com",
  "baseUrl": "https://your-railway-domain.up.railway.app"
}
```

## Step 5: Test Signup Email

1. **Create Test Account:**
   - Go to: `https://your-railway-domain.up.railway.app/signup.html`
   - Create a new account
   - Use a real email address you can check

2. **Check Your Email:**
   - Look in inbox (and spam folder)
   - Should receive welcome email within seconds

3. **Check Railway Logs:**
   - Should see: `✅ Welcome email sent successfully to: user@example.com`
   - Should see: `✅ Email message ID: ...`

## Troubleshooting

### Email Not Sending

**Check Railway Logs for:**
- `❌ Error sending welcome email`
- `❌ Authentication failed`
- `❌ Connection failed`

**Common Issues:**

1. **Gmail App Password Wrong:**
   - Make sure you're using App Password (16 chars)
   - NOT your regular Gmail password
   - Re-generate if needed

2. **SendGrid API Key Wrong:**
   - Make sure `EMAIL_USER=apikey` (literally "apikey")
   - Make sure API key has correct permissions
   - Check API key is active in SendGrid

3. **Email Going to Spam:**
   - Normal for Gmail/SendGrid initially
   - Check spam folder
   - Email will improve over time

4. **Email Configuration Not Detected:**
   - Variables must be set in Railway
   - Must redeploy after adding variables
   - Check variable names are exact (case-sensitive)

### Email Status Check

**Test endpoint:**
```
https://your-railway-domain.up.railway.app/api/email-status
```

**If `emailConfigured: false`:**
- Check `EMAIL_USER` is set
- Check `EMAIL_PASSWORD` is set
- Check variable names are correct
- Restart Railway service

### Registration Still Works

**Important:** Even if email fails, registration still succeeds!
- User account is created
- Email is sent asynchronously
- If email fails, it's logged but doesn't break signup

## Email Template

The welcome email includes:
- ✅ Welcome message
- ✅ Account details (name, email, company, type)
- ✅ Link to dashboard
- ✅ Branded HTML design
- ✅ Plain text fallback

## Quick Setup Checklist

- [ ] Choose email service (Gmail/SendGrid/SMTP)
- [ ] Get credentials (app password or API key)
- [ ] Add environment variables to Railway
- [ ] Verify deployment succeeded
- [ ] Check `/api/email-status` endpoint
- [ ] Create test account
- [ ] Check email inbox
- [ ] Verify email received

## Production Recommendations

**For Production:**
1. Use SendGrid or custom SMTP (not Gmail)
2. Set up proper `EMAIL_FROM` domain
3. Configure SPF/DKIM records (for better deliverability)
4. Monitor email sending limits
5. Set up email bounce handling

**For Testing:**
- Gmail works fine
- Use your personal Gmail with app password
- Test with real email addresses

## Summary

✅ **Email functionality is already built** - just needs credentials  
✅ **Add environment variables** to Railway  
✅ **Users automatically get emails** when they sign up  
✅ **Email failures don't break signup** - accounts still created  
✅ **Check Railway logs** to verify emails are sending  

Once you add the email credentials to Railway, all new signups will automatically receive welcome confirmation emails!

