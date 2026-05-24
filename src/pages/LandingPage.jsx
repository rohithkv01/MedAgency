import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import AgencyCard from '../components/AgencyCard';

export default function LandingPage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('/api/agencies');
        setFeatured(data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch agencies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <main id="landing-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            ⚕️ Trusted Medical Distribution Platform
          </div>
          <h1>
            Find Your <span>Medical Agency</span> Instantly
          </h1>
          <p>
            Search and connect with reliable medical wholesale agencies across India. Discover trusted distributors and contact them directly.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Stats */}
      <section className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 2 }}>
        <div className="dashboard-stats" id="stats-section">
          <div className="stat-card glass-card">
            <div className="stat-label">Platform</div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>🔍 Search & Find</div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-label">Contact</div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>📞 Call Directly</div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-label">For Owners</div>
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>🏥 Register Agency</div>
          </div>
        </div>
      </section>

      {/* Featured Agencies */}
      <section className="container" style={{ padding: '60px 24px' }} id="featured-section">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2>Browse Agencies</h2>
          <p>Discover medical wholesale agencies and connect with them</p>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading agencies...</p>
          </div>
        ) : featured.length > 0 ? (
          <>
            <div className="agencies-grid">
              {featured.map((agency) => (
                <AgencyCard key={agency._id} agency={agency} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/agencies" className="btn btn-secondary btn-lg" id="view-all-btn">
                View All Agencies →
              </Link>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🏥</div>
            <h3>No agencies registered yet</h3>
            <p>Be the first to register your medical agency!</p>
            <Link to="/register" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Register Your Agency
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
