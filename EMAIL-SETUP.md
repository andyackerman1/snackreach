# Email Configuration for SnackReach

Welcome emails are automatically sent to users when they sign up. To enable email sending, configure your email service.

## Quick Setup

### Option 1: Gmail (Easiest for Development)

1. **Enable "App Passwords" for your Gmail account:**
   - Go to your Google Account settings
   - Security → 2-Step Verification (must be enabled)
   - App passwords → Generate a new app password
   - Copy the 16-character password

2. **Add to your `.env` file:**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   EMAIL_FROM=your-email@gmail.com
   BASE_URL=https://snackreach-production.up.railway.app
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Sign up for SendGrid** (free tier available)
2. **Create an API key** in SendGrid dashboard
3. **Add to your `.env` file:**
   ```env
   EMAIL_SERVICE=sendgrid
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   EMAIL_FROM=noreply@snackreach.com
   BASE_URL=https://snackreach-production.up.railway.app
   ```

### Option 3: Generic SMTP

For any SMTP server:

```env
EMAIL_SERVICE=smtp
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
SMTP_HOST=smtp.your-domain.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_FROM=noreply@your-domain.com
BASE_URL=https://snackreach-production.up.railway.app
```

## Railway Setup

1. **Add environment variables in Railway dashboard:**
   - Go to your Railway project
   - Settings → Variables
   - Add the email variables above

2. **For Gmail:**
   - `EMAIL_SERVICE=gmail`
   - `EMAIL_USER=your-email@gmail.com`
   - `EMAIL_PASSWORD=your-app-password`
   - `EMAIL_FROM=your-email@gmail.com`
   - `BASE_URL=https://snackreach-production.up.railway.app`

## Testing

After configuration:
1. Sign up a new account
2. Check the email inbox
3. Check server logs for email sending status

## Troubleshooting

**Email not sending?**
- Check server logs for email errors
- Verify environment variables are set correctly
- For Gmail: Make sure you're using an App Password, not your regular password
- Check spam folder

**Email configured but not sending?**
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are set
- Check that `nodemailer` package is installed: `npm install nodemailer`
- Restart the server after adding environment variables

## What Gets Sent

When users sign up, they automatically receive:
- Welcome email with account details
- Link to access their dashboard
- Information about their account type and features

The email is sent asynchronously, so registration won't fail if email sending fails (it will just log an error).

