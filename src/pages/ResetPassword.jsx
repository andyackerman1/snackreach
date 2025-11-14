import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!token || !email) {
      return setError("Invalid reset link. Please request a new password reset.");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters long");
    }

    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await axios.post(`${apiUrl}/auth/reset-password`, {
        email,
        token,
        password
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Link invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto", padding: "20px" }}>
        <h2>Password Reset Successful</h2>
        <div style={{ padding: "20px", backgroundColor: "#f0f9ff", borderRadius: "8px", marginTop: "20px" }}>
          <p>Your password has been successfully reset!</p>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: "20px" }}>
      <h2>Reset Password</h2>
      <form onSubmit={submit} style={{ marginTop: "20px" }}>
        {error && (
          <div style={{ padding: "10px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "4px", marginBottom: "15px" }}>
            {error}
          </div>
        )}
        
        <input
          type="password"
          required
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        <input
          type="password"
          required
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
