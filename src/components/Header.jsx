import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="header" id="main-header">
      <div className="header-inner">
        <Link to="/" className="header-brand" style={{ textDecoration: 'none' }}>
          <div className="logo-icon">M</div>
          <h1>MedAgency</h1>
        </Link>

        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`} id="main-nav">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/agencies" onClick={() => setMenuOpen(false)}>Agencies</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="btn btn-sm btn-secondary" onClick={handleLogout} id="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary" onClick={() => setMenuOpen(false)} id="login-btn">
              Owner Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
