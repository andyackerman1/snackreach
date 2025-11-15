import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";

export default function SignUpPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!isLoaded || !signIn) {
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

  function selectUserType(type) {
    setSelectedUserType(type);
    setShowForm(true);
    setError("");
    // Scroll to form
    setTimeout(() => {
      document.getElementById("signup-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("Please read and accept the Terms of Service and Privacy Policy to continue.");
      setShowTerms(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }

    // Validate required fields based on user type
    if (selectedUserType === "startup" && !formData.company) {
      setError("Company name is required for snack companies.");
      return;
    }

    try {
      // Register via backend API
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          companyName: selectedUserType === "startup" ? formData.company : formData.name, // Use name for snackers if no company
          phone: formData.phone,
          userType: selectedUserType === "startup" ? "startup" : "snacker",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // User is already created in Clerk by the backend
        // Now sign them in with Clerk
        try {
          const signInResult = await signIn.create({
            identifier: formData.email,
            password: formData.password,
          });

          if (signInResult.status === "complete") {
            await setActive({ session: signInResult.createdSessionId });
            navigate("/dashboard");
          } else {
            setError("Please complete the sign-in process.");
          }
        } catch (signInError) {
          console.error("Sign-in error:", signInError);
          // If sign-in fails, user might need to verify email or there's an issue
          setError(signInError.errors?.[0]?.message || "Account created but sign-in failed. Please try logging in.");
        }
      } else {
        // Show detailed error message from backend
        const errorMsg = data.error || "Registration failed. Please try again.";
        const suggestion = data.suggestion ? ` ${data.suggestion}` : "";
        setError(errorMsg + suggestion);
        
        // If email already exists, suggest logging in
        if (errorMsg.includes("already registered") || errorMsg.includes("already exists")) {
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed. Please try again.");
    }
  }

  const formTitle = selectedUserType === "startup" 
    ? "Join as a Snack Company" 
    : "Join as a Snacker";
  const formSubtitle = selectedUserType === "startup"
    ? "Share your snacks with snack lovers"
    : "Discover amazing snacks and explore exciting new brands";

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

      {/* Signup Section */}
      <section className="signup-section">
        <div className="container">
          <div className="signup-container">
            <div className="signup-header">
              <h1>Join SnackReach</h1>
              <p>Choose your role to get started</p>
            </div>
            
            <div className="user-type-selection">
              <div
                className={`user-type-card ${selectedUserType === "startup" ? "selected" : ""}`}
                onClick={() => selectUserType("startup")}
              >
                <div className="user-type-icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <h3>Snack Company</h3>
                <p>I'm a snack company looking to share my products with snack lovers</p>
                <ul className="benefits-list">
                  <li><i className="fas fa-check"></i> Reach snack enthusiasts directly</li>
                  <li><i className="fas fa-check"></i> Build brand awareness</li>
                  <li><i className="fas fa-check"></i> Get feedback from real customers</li>
                  <li><i className="fas fa-check"></i> Share your unique snacks</li>
                </ul>
              </div>
              
              <div
                className={`user-type-card ${selectedUserType === "snacker" ? "selected" : ""}`}
                onClick={() => selectUserType("snacker")}
              >
                <div className="user-type-icon">
                  <i className="fas fa-shopping-bag"></i>
                </div>
                <h3>Snacker</h3>
                <p>I want to discover amazing snack companies and explore their products</p>
                <ul className="benefits-list">
                  <li><i className="fas fa-check"></i> Browse snack companies</li>
                  <li><i className="fas fa-check"></i> Explore product catalogs</li>
                  <li><i className="fas fa-check"></i> Discover new brands</li>
                  <li><i className="fas fa-check"></i> Find your favorite snacks</li>
                </ul>
              </div>
            </div>

            {showForm && (
              <form id="signup-form" onSubmit={handleSubmit} className="signup-form">
                <div className="form-header">
                  <h2 id="form-title">{formTitle}</h2>
                  <p id="form-subtitle">{formSubtitle}</p>
                </div>
                
                {error && (
                  <div className="error-message" style={{ display: "block", marginBottom: "1rem" }}>
                    {error}
                  </div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="signup-name">Full Name</label>
                    <input
                      type="text"
                      id="signup-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="signup-email">Email</label>
                    <input
                      type="email"
                      id="signup-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                {selectedUserType === "startup" && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="signup-company">Company Name</label>
                      <input
                        type="text"
                        id="signup-company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="signup-phone">Phone Number</label>
                      <input
                        type="tel"
                        id="signup-phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}
                {selectedUserType === "snacker" && (
                  <div className="form-group">
                    <label htmlFor="signup-phone">Phone Number</label>
                    <input
                      type="tel"
                      id="signup-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    type="password"
                    id="signup-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="signup-confirm">Confirm Password</label>
                  <input
                    type="password"
                    id="signup-confirm"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                
                <div className="terms-section">
                  <div className="terms-checkbox">
                    <input
                      type="checkbox"
                      id="accept-terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      required
                    />
                    <label htmlFor="accept-terms">
                      I agree to the{" "}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowTerms(true);
                        }}
                      >
                        Terms of Service and Privacy Policy
                      </a>
                    </label>
                  </div>
                  <p className="terms-note">
                    By creating an account, you acknowledge that you have read and understand our terms, including important disclaimers about shipping, product safety, and liability.
                  </p>
                </div>
                
                <button type="submit" className="btn btn-primary btn-large btn-full">
                  <i className="fas fa-user-plus"></i>
                  Create Account
                </button>
                
                <p className="login-link">
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Terms Modal */}
      {showTerms && (
        <div className="modal" style={{ display: "flex" }} onClick={() => setShowTerms(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Terms of Service and Privacy Policy</h2>
              <span className="close" onClick={() => setShowTerms(false)}>&times;</span>
            </div>
            <div className="modal-body terms-content">
              <div className="terms-section-content">
                <h3>1. Platform Overview</h3>
                <p>SnackReach is a marketplace platform where snack lovers discover new and exciting snacks from snack companies. We facilitate connections between snack enthusiasts and brands, but we do not participate in transactions, shipping, or product fulfillment.</p>
                
                <h3>2. Shipping and Fulfillment</h3>
                <p><strong>SnackReach is not responsible for shipping, delivery, or fulfillment of any products.</strong> All shipping arrangements, costs, and logistics are the sole responsibility of the snack companies. We do not guarantee delivery times, shipping methods, or product availability. Users are responsible for coordinating directly with companies regarding shipping arrangements.</p>
                
                <h3>3. Product Safety and Liability</h3>
                <p>SnackReach does not verify, test, or guarantee the safety, quality, or compliance of any products listed on the platform. All product safety, quality control, and regulatory compliance is the sole responsibility of the snack companies. Consumers assume all risks associated with consuming products purchased through the platform.</p>
                
                <h3>4. User Responsibilities</h3>
                <p>Users are responsible for all aspects of their transactions, including payment processing, product delivery, quality assurance, and customer service. SnackReach acts solely as a platform for connection and does not participate in or guarantee any transactions.</p>
                
                <h3>5. Privacy Policy</h3>
                <p>We collect and store user information necessary for platform functionality. User data is stored securely and used only for platform operations. We do not sell user data to third parties.</p>
                
                <h3>6. Account Security</h3>
                <p>Users are responsible for maintaining the security of their accounts and passwords. SnackReach is not liable for unauthorized access to user accounts.</p>
                
                <h3>7. Limitation of Liability</h3>
                <p>SnackReach is not liable for any damages, losses, or issues arising from transactions, product quality, shipping problems, or any other interactions between users on the platform.</p>
                
                <h3>8. Dispute Resolution</h3>
                <p>Any disputes between users must be resolved directly between the parties involved. SnackReach is not responsible for mediating or resolving disputes.</p>
                
                <h3>9. Platform Availability</h3>
                <p>SnackReach does not guarantee uninterrupted platform availability and is not liable for service interruptions or technical issues.</p>
                
                <h3>10. Changes to Terms</h3>
                <p>SnackReach reserves the right to modify these terms at any time. Users will be notified of significant changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
                
                <h3>11. Contact Information</h3>
                <p>For questions about these terms, please contact us through the platform or at the contact information provided in your account dashboard.</p>
                
                <div className="terms-acceptance">
                  <p><strong>By checking the box and creating an account, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and Privacy Policy.</strong></p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => { setAcceptTerms(true); setShowTerms(false); }}>
                I Understand and Accept
              </button>
              <button className="btn btn-outline" onClick={() => setShowTerms(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
