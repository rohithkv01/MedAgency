import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OwnerRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, 'owner');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page" id="register-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Register to list your medical agency</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} id="register-form">
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input type="text" id="reg-name" className="form-input" placeholder="Your full name"
              value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input type="email" id="reg-email" className="form-input" placeholder="owner@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input type="password" id="reg-password" className="form-input" placeholder="Min 6 characters"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <input type="password" id="reg-confirm" className="form-input" placeholder="Re-enter password"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} id="register-submit">
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </main>
  );
}
