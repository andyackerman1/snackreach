# Owner Login Help

## Quick Login Credentials

**Username:** `Andy`  
**Password:** `BoJackson421`

## Troubleshooting

### If login doesn't work:

1. **Open Browser Console (F12)**
   - Check for JavaScript errors
   - Look for any red error messages

2. **Check localStorage**
   - Open browser console
   - Type: `localStorage.getItem('snackreach_user_type')`
   - Should return: `"owner"`

3. **Clear and try again**
   - Open browser console
   - Type: `localStorage.clear()`
   - Refresh page
   - Try logging in again

4. **Use Quick Demo Access**
   - Click the "Quick Demo Access" button
   - This creates a demo owner account automatically

5. **Check file paths**
   - Make sure `owner-login.html` and `owner-dashboard.html` are in the same folder
   - Make sure you're opening the file from the correct location

## Alternative Login Methods

### Method 1: Quick Demo Access Button
- Click "Quick Demo Access" button
- Automatically logs you in

### Method 2: Admin Credentials
- Username: `Andy`
- Password: `BoJackson421`

### Method 3: Sign Up First
- Go to `owner-signup.html`
- Create an owner account
- Then log in with those credentials

## Common Issues

**Issue:** "Access denied" when trying to access dashboard
- **Fix:** Make sure you logged in successfully first
- Check that `localStorage` has `snackreach_user_type` set to `"owner"`

**Issue:** Page doesn't redirect after login
- **Fix:** Check browser console for errors
- Make sure JavaScript is enabled
- Try clearing browser cache

**Issue:** "Owner account not found"
- **Fix:** Use "Quick Demo Access" button or sign up first

## Still Not Working?

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try logging in
4. Check what errors appear
5. Share those errors for help

