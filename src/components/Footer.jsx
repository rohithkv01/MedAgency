import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>MedAgency</h3>
          <p>Your trusted partner for finding reliable medical wholesale agencies. Connect with distributors across India.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/agencies">Browse Agencies</Link></li>
            <li><Link to="/login">Owner Login</Link></li>
            <li><Link to="/register">Register Agency</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Information</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MedAgency. All rights reserved.</p>
      </div>
    </footer>
  );
}
