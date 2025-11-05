# How to Update API URL After Deployment

After you deploy your backend and get the URL, you need to update it in one place:

## Quick Update (1 file)

**File:** `js/api.js`

**Line 10:** Change this line:
```javascript
const PRODUCTION_API_URL = 'https://your-backend-url.onrender.com/api';
```

To your actual backend URL:
```javascript
const PRODUCTION_API_URL = 'https://your-actual-backend.onrender.com/api';
```

## Alternative: Update All Files Manually

If you prefer to update each file individually, search for:
- `http://localhost:3000/api`

And replace with:
- `https://your-backend-url.onrender.com/api`

**Files to check:**
- `signup.html`
- `snack-dashboard.html`
- `office-dashboard.html`
- `owner-dashboard.html`
- `owner-login.html`
- `owner-signup.html`
- `js/api.js`

## After Updating

1. Save the file(s)
2. Re-deploy to Netlify (drag and drop again, or push to GitHub if using Git)
3. Your site will now use the production backend!

