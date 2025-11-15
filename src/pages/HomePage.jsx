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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ padding: "100px 0 60px" }}>
        <div className="container">
          <div style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            <h1 className="hero-title" style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              lineHeight: "1.3",
              letterSpacing: "0.01em",
              marginBottom: "2rem",
              textAlign: "center",
              maxWidth: "900px",
              width: "100%",
              marginLeft: "auto",
              marginRight: "auto",
              padding: "0 20px"
            }}>
              Discover <span className="highlight">Start Up Snacks</span> and <span className="highlight">Their Innovative Flavors</span>
            </h1>
            <p className="hero-description" style={{
              fontSize: "1.15rem",
              lineHeight: "1.7",
              textAlign: "center",
              margin: "0",
              maxWidth: "800px"
            }}>
              SnackReach is the marketplace where snack lovers discover amazing food companies 
              and explore their products. Browse unique snacks, support emerging brands, 
              and find your next favorite treat.
            </p>
            <div style={{
              marginTop: "2.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center"
            }}>
              <Link
                to="/signup"
                className="btn btn-outline btn-large"
                style={{ color: "#fb923c", borderColor: "#fb923c" }}
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="btn btn-outline btn-large"
                style={{ color: "#fb923c", borderColor: "#fb923c" }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" style={{ padding: "60px 0 80px" }}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: "2.5rem" }}>Why Choose SnackReach?</h2>
          <div className="features-grid" style={{ maxWidth: "1000px", margin: "0 auto", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-store"></i>
              </div>
              <h3>Discover New Snacks</h3>
              <p>Find unique, innovative snacks from exciting brands before they hit mainstream markets.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-building"></i>
              </div>
              <h3>Snack Discovery</h3>
              <p>Browse amazing snack companies and explore their full product catalogs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3>Great Deals</h3>
              <p>Get exclusive discounts and special pricing from exciting new snack brands.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Community</h3>
              <p>Join a community of snack lovers discovering new and exciting treats.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

