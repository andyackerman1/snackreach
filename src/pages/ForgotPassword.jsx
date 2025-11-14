import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await axios.post(`${apiUrl}/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: "20px" }}>
      <h2>Forgot Password</h2>

      {sent ? (
        <div style={{ padding: "20px", backgroundColor: "#f0f9ff", borderRadius: "8px", marginTop: "20px" }}>
          <p>If an account exists, a reset link was sent.</p>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
            Please check your email for instructions to reset your password.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} style={{ marginTop: "20px" }}>
          {error && (
            <div style={{ padding: "10px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "15px" }}>
              {error}
            </div>
          )}
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px"
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#9ca3af" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}
    </div>
  );
}
