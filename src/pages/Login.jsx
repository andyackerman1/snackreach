import { useState, useEffect } from "react";
import { useSignIn, useAuth } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!signIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-rose-600 mb-2">Configuration Error</h2>
            <p className="text-slate-600">
              Clerk is not properly configured. Please check that VITE_CLERK_PUBLISHABLE_KEY is set correctly.
            </p>
          </div>
        </div>
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
        try {
          await setActive({ session: result.createdSessionId });
          navigate("/dashboard");
        } catch (sessionError) {
          // If session already exists, just navigate to dashboard
          if (
            sessionError.errors?.[0]?.message?.includes("Session already exists") ||
            sessionError.errors?.[0]?.code === "session_exists"
          ) {
            navigate("/dashboard");
          } else {
            throw sessionError;
          }
        }
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error(err);
      // Handle "Session already exists" error gracefully
      if (
        err.errors?.[0]?.message?.includes("Session already exists") ||
        err.errors?.[0]?.code === "session_exists"
      ) {
        navigate("/dashboard");
      } else {
        setError(err.errors?.[0]?.message || "Invalid email or password. Please try again.");
      }
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    try {
      const response = await fetch("https://snackreach-production.up.railway.app/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotSuccess(data.message || "Password reset link sent! Check your email.");
        setForgotEmail("");
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotSuccess("");
        }, 3000);
      } else {
        setForgotError(data.error || "Failed to send reset link. Please try again.");
      }
    } catch (err) {
      setForgotError("Unable to connect to server. Please check your connection or try again later.");
    }
  }

  return (
    <div
      className="bg-slate-100 flex flex-col"
      style={{ minHeight: "100dvh" }}
    >
      {/* Navigation */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-base font-semibold text-rose-600 sm:text-lg">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 sm:h-9 sm:w-9">
              <i className="fas fa-utensils"></i>
            </span>
            SnackReach
          </Link>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            B2B logistics to connect office managers with emerging snack brands.
          </p>
          <Link
            to="/signup"
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md sm:w-auto"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Login Content */}
      <main
        className="flex-1 px-4 py-8 pb-36 sm:py-12 sm:pb-32 lg:flex lg:items-center lg:justify-center"
        style={{
          paddingBottom: "calc(7rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="mx-auto w-full max-w-md">
          <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-xl shadow-rose-100/50 sm:p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
              <p className="mt-2 text-sm text-slate-600">Sign in to your SnackReach account</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-6 pb-4">
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base shadow-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  inputMode="email"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold text-rose-600 hover:text-rose-500"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base shadow-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-rose-500"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                Remember me
              </label>

              <div
                className="-mx-6 sticky bottom-0 left-0 right-0 bg-white/95 px-6 pb-2 pt-3 shadow-[0_-12px_24px_rgba(15,23,42,0.08)] backdrop-blur sm:-mx-8 sm:px-8 sm:pb-3 sm:pt-4"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
              >
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-rose-200 transition focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
                >
                  <i className="fas fa-sign-in-alt transition-transform group-hover:translate-x-0.5"></i>
                  Sign In
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              Don't have an account? {" "}
              <Link to="/signup" className="font-semibold text-rose-600 hover:text-rose-500">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/60 px-4"
          onClick={() => setShowForgotPassword(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Reset Password</h2>
              <button
                className="text-2xl leading-none text-slate-400 hover:text-rose-500"
                onClick={() => setShowForgotPassword(false)}
                aria-label="Close reset password modal"
              >
                &times;
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            {forgotError && (
              <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
                {forgotError}
              </div>
            )}
            {forgotSuccess && (
              <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                <i className="fas fa-check-circle mr-1"></i>
                {forgotSuccess}
              </div>
            )}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  inputMode="email"
                  autoComplete="email"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-3 text-base font-semibold text-white shadow"
              >
                <i className="fas fa-paper-plane"></i>
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
