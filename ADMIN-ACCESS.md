# Admin Dashboard Access

## Quick Access Links

### Local Development
- **URL**: `http://localhost:3000/admin-dashboard.html`
- **Login**: Use the credentials below

### Railway Production
- **URL**: `https://snackreach-production.up.railway.app/admin-dashboard.html`
- **Login**: Use the credentials below

## Default Admin Credentials

**Email**: `admin@snackreach.com`  
**Password**: `SnackReach2024!`

## Change Admin Credentials (Security)

To change the admin credentials, set these environment variables on Railway:

1. Go to Railway dashboard → Your project → Variables
2. Add these variables:
   - `ADMIN_EMAIL` = Your email
   - `ADMIN_PASSWORD` = Your secure password

For local development, create a `.env` file in `backend/`:
```
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

## Features

- **View All Accounts**: See every account created on the platform
- **Statistics**: Total accounts, startups, office managers, active today
- **Auto-refresh**: Updates every 30 seconds
- **Secure Login**: JWT-based authentication
- **Persistent Sessions**: Login lasts 10 years (essentially permanent)

## Security Notes

⚠️ **IMPORTANT**: Change the default credentials in production!

The admin dashboard is protected by:
- JWT token authentication
- Admin-only endpoints
- Secure password validation

