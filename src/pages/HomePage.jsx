import { Link } from "react-router-dom";

export default function HomePage() {
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
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/signup" className="btn btn-outline">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-container hero-centered" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 40px" }}>
            <h1 className="hero-title" style={{ marginBottom: "2rem", lineHeight: "1.1" }}>
              Connect Food Startups with <span className="highlight">Office Spaces</span>
            </h1>
            <p className="hero-description" style={{ fontSize: "1.25rem", lineHeight: "1.8", maxWidth: "700px", margin: "0 auto" }}>
              SnackReach is the B2B marketplace where innovative food startups meet office managers 
              looking for the perfect snacks. Discover unique products, support emerging brands, 
              and keep your team happy with delicious, healthy options.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose SnackReach?</h2>
          <div className="features-grid" style={{ maxWidth: "1000px", margin: "0 auto", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-store"></i>
              </div>
              <h3>Discover Startups</h3>
              <p>Find unique, innovative food products from emerging brands before they hit mainstream markets.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-building"></i>
              </div>
              <h3>Office Solutions</h3>
              <p>Perfect for office managers looking to provide quality snacks that keep teams energized and happy.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3>Great Deals</h3>
              <p>Get exclusive discounts and special pricing from startups building brand awareness.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community</h3>
              <p>Join a community of food startups and office managers building the future of workplace snacking.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

