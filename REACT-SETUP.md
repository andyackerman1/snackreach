# React + Clerk Setup Guide

## ✅ What's Set Up

Your React app is ready with Clerk authentication! Here's what you have:

- **Login Page** (`/login`) - Uses Clerk's `<SignIn />` component
- **Sign Up Page** (`/signup`) - Uses Clerk's `<SignUp />` component  
- **Dashboard** (`/dashboard`) - Protected page showing user info
- **ClerkProvider** - Wraps entire app for authentication
- **React Router** - Handles navigation between pages
- **Tailwind CSS** - For styling

## 🚀 How to Run

### Option 1: Run React Frontend Only
```bash
npm run dev
```
This starts Vite dev server on `http://localhost:3000`

### Option 2: Run Both Frontend + Backend

**Terminal 1 (React Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend API):**
```bash
npm run start:backend
```

## 📁 File Structure

```
snackconnect/
├── src/
│   ├── App.jsx              # Main app with ClerkProvider & routing
│   ├── index.jsx            # React entry point
│   ├── index.css            # Tailwind CSS
│   └── pages/
│       ├── LoginPage.jsx    # Your login component
│       ├── SignUpPage.jsx   # Sign up page
│       └── Dashboard.jsx    # Protected dashboard
├── index-react.html         # HTML entry point for React
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies
```

## 🔑 Clerk Configuration

Your Clerk publishable key is already set in `src/App.jsx`:
```javascript
const CLERK_PUBLISHABLE_KEY = "pk_test_cHJldHR5LXRyZWVmcm9nLTg4LmNsZXJrLmFjY291bnRzLmRldiQ";
```

## 🎯 Routes

- `/` → Redirects to `/login`
- `/login` → Clerk SignIn component
- `/signup` → Clerk SignUp component
- `/dashboard` → Protected dashboard (requires auth)

## 🛠️ Building for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

## 📝 Your LoginPage Component

The component you provided is now at `src/pages/LoginPage.jsx`:

```jsx
import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn redirectUrl="/dashboard" />
    </div>
  );
}
```

## 🔄 Integration with Backend

The Vite config proxies `/api` requests to your backend:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- API calls from React: `/api/...` (automatically proxied)

## 🎨 Styling

Tailwind CSS is configured and ready. Use Tailwind classes in your components:
- `flex`, `justify-center`, `items-center`
- `min-h-screen`, `bg-gray-50`
- etc.

## 🚨 Troubleshooting

**If you see "Module not found" errors:**
- Make sure you ran `npm install` in the root directory
- Check that `node_modules/` exists

**If Clerk components don't work:**
- Verify your Clerk publishable key in `src/App.jsx`
- Check that `@clerk/clerk-react` is installed: `npm list @clerk/clerk-react`

**If routing doesn't work:**
- Make sure `react-router-dom` is installed
- Check browser console for errors

## 📦 Next Steps

1. **Customize Dashboard**: Edit `src/pages/Dashboard.jsx` to add your features
2. **Add More Pages**: Create new components in `src/pages/` and add routes in `App.jsx`
3. **Connect to Backend**: Use `fetch()` or axios to call your `/api` endpoints
4. **Get User Data**: Use `useUser()` hook from Clerk to access user info

## 💡 Example: Using Clerk User Data

```jsx
import { useUser } from "@clerk/clerk-react";

function MyComponent() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;
  
  return (
    <div>
      <p>Hello, {user.firstName}!</p>
      <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
      <p>User Type: {user.publicMetadata?.userType}</p>
    </div>
  );
}
```

