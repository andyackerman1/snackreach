# Check Email Configuration

If you didn't receive a welcome email after signing up, follow these steps:

## Step 1: Check Email Status

### Local Server:
Visit: `http://localhost:3000/api/email-status`

### Railway Server:
Visit: `https://snackreach-production.up.railway.app/api/email-status`

This will show you:
- Whether email is configured
- Which email service is being used
- What environment variables are set

## Step 2: Check Server Logs

When you sign up, the server logs will show:
- `📧 Attempting to send welcome email to: [email]`
- `📧 Email configured: true/false`
- `📧 EMAIL_USER set: true/false`
- `📧 EMAIL_PASSWORD set: true/false`

If you see `⚠️ Email not configured`, you need to set up email credentials.

## Step 3: Set Up Email (Quick Guide)

### For Local Development (Gmail):

1. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in with your Gmail account
   - Enable 2-Step Verification if not already enabled
   - Generate a new app password (16 characters)
   - Copy the password

2. **Add to Local `.env` file:**
   ```bash
   cd backend
   ```
   
   Create or edit `.env` file:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   EMAIL_FROM=your-email@gmail.com
   BASE_URL=http://localhost:3000
   ```

3. **Restart the server:**
   ```bash
   npm start
   ```

### For Railway (Production):

1. **Go to Railway Dashboard:**
   - Open your Railway project
   - Go to Settings → Variables

2. **Add these environment variables:**
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   EMAIL_FROM=your-email@gmail.com
   BASE_URL=https://snackreach-production.up.railway.app
   ```

3. **Railway will auto-deploy** after you add the variables

## Step 4: Test Again

1. Create a new test account
2. Check server logs for email sending status
3. Check your email inbox (and spam folder)

## Common Issues

**"Email not configured" warning:**
- ✅ Set `EMAIL_USER` and `EMAIL_PASSWORD` in environment variables
- ✅ Restart the server after adding variables

**Authentication errors:**
- ✅ For Gmail: Use App Password, not your regular password
- ✅ Make sure 2-Step Verification is enabled on Gmail

**Email sent but not received:**
- ✅ Check spam/junk folder
- ✅ Verify email address is correct
- ✅ Check server logs for success message

**Connection errors:**
- ✅ Check firewall/network settings
- ✅ Verify SMTP settings are correct
- ✅ For Railway: Check if port 587 is allowed

## Alternative: Use SendGrid (Recommended for Production)

SendGrid is better for production and has a free tier:

1. Sign up at https://sendgrid.com
2. Create an API key
3. Set in Railway:
   ```
   EMAIL_SERVICE=sendgrid
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   EMAIL_FROM=noreply@snackreach.com
   ```

See `EMAIL-SETUP.md` for detailed instructions.

