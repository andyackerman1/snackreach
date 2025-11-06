import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isLoaded) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!signIn) {
    return (
      <div className="max-w-md mx-auto mt-20 p-4 bg-red-50 border border-red-200 rounded">
        <h2 className="text-red-800 font-semibold mb-2">Configuration Error</h2>
        <p className="text-red-600 text-sm">
          Clerk is not properly configured. Please check that VITE_CLERK_PUBLISHABLE_KEY is set correctly.
        </p>
      </div>
    );
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-xl font-semibold mb-4 text-center">Sign in</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

