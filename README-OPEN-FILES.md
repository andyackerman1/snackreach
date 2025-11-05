# 📂 How to Open Files Locally (No Installation Needed)

## ✅ You CAN Open HTML Files Directly!

You can view the pages by opening them directly in your browser:

### Method 1: Double-Click in Finder
1. Open **Finder**
2. Go to: `/Users/andy.ackerman/snackconnect`
3. **Double-click** any HTML file:
   - `index.html` - Main landing page
   - `login.html` - Login page  
   - `signup.html` - Signup page
   - `owner-login.html` - Owner login

### Method 2: Drag & Drop
1. Open your **web browser** (Chrome, Safari, Firefox)
2. Open **Finder** and navigate to `/Users/andy.ackerman/snackconnect`
3. **Drag** an HTML file into the browser window

### Method 3: Right-Click → Open With
1. Right-click any HTML file
2. Select **"Open With"** → Choose your browser

## ⚠️ Important Limitation

**The pages will load and look correct, BUT:**
- ❌ Login won't work (needs backend API)
- ❌ Signup won't work (needs backend API)
- ❌ Data won't save (needs backend database)
- ✅ Pages will display correctly
- ✅ Navigation will work
- ✅ You can view all the UI

## 🌐 For Full Functionality

To use login/signup features, you have two options:

1. **Use Production Site** (easiest):
   - https://snackreach-production.up.railway.app/
   - Works immediately, no installation

2. **Run Local Server** (requires Node.js):
   - Install Node.js from https://nodejs.org/
   - Then run: `cd backend && npm install && node server.js`
   - Then visit: http://localhost:3000

## 📝 Summary

- **View pages:** Just double-click HTML files ✅
- **Use features:** Need server or use production site ⚠️

