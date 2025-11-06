import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  if (!isLoaded) {
    return (
      <div className="signup-section">
        <div className="container">
          <div className="signup-container">
            <div className="text-center">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!signIn) {
    return (
      <div className="signup-section">
        <div className="container">
          <div className="signup-container">
            <div className="signup-form">
              <div className="error-message">
                <h2>Configuration Error</h2>
                <p>
                  Clerk is not properly configured. Please check that VITE_CLERK_PUBLISHABLE_KEY is set correctly.
                </p>
              </div>
            </div>
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
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      } else {
        console.log(result);
      }
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Invalid email or password. Please try again.");
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    
    try {
      const response = await fetch("/api/forgot-password", {
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
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <i className="fas fa-utensils"></i>
            <span>SnackReach</span>
          </div>
          <div className="nav-menu">
            <Link to="/" className="nav-link">Back to Home</Link>
          </div>
        </div>
      </nav>

      {/* Login Section */}
      <section className="signup-section">
        <div className="container">
          <div className="signup-container">
            <div className="signup-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your SnackReach account</p>
            </div>

            <form onSubmit={handleLogin} className="signup-form">
              <div className="form-header">
                <h2>Login to Your Account</h2>
                <p>Enter your credentials to access your dashboard</p>
              </div>
              
              {error && (
                <div className="error-message" style={{ display: "block", marginBottom: "1rem" }}>
                  {error}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#6b7280"
                    }}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </div>
                </div>
              </div>
              
              <div className="form-group" style={{ textAlign: "right", marginTop: "-10px" }}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(true);
                  }}
                  style={{ color: "#667eea", textDecoration: "none", fontSize: "0.9rem" }}
                >
                  Forgot Password?
                </a>
              </div>
              
              <div className="form-group checkbox-group">
                <input type="checkbox" id="remember-me" />
                <label htmlFor="remember-me">Remember me</label>
              </div>
              
              <button type="submit" className="btn btn-primary btn-large btn-full">
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </button>
              
              <div className="form-footer">
                <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal" style={{ display: "flex" }} onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset Password</h2>
              <button className="modal-close" onClick={() => setShowForgotPassword(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Enter your email address and we'll send you a link to reset your password.</p>
              {forgotError && (
                <div className="error-message" style={{ display: "block", marginBottom: "15px" }}>
                  {forgotError}
                </div>
              )}
              {forgotSuccess && (
                <div className="success-message" style={{ display: "block", marginBottom: "15px" }}>
                  <i className="fas fa-check-circle"></i> {forgotSuccess}
                </div>
              )}
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label htmlFor="forgot-email">Email Address</label>
                  <input
                    type="email"
                    id="forgot-email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-large">
                  <i className="fas fa-paper-plane"></i>
                  Send Reset Link
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
