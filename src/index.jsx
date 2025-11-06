import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
  console.error("Please set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file or Railway variables");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Configuration Error</h1>
        <p>Clerk publishable key is missing. Please set VITE_CLERK_PUBLISHABLE_KEY in your environment variables.</p>
        <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "1rem" }}>
          For local development: Create a .env.local file with VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
        </p>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          For Railway: Set VITE_CLERK_PUBLISHABLE_KEY in Railway Variables
        </p>
      </div>
    )}
  </React.StrictMode>
);

