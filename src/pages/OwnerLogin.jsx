import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OwnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page" id="login-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to manage your agencies</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input type="email" id="login-email" className="form-input" placeholder="owner@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input type="password" id="login-password" className="form-input" placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} id="login-submit">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </main>
  );
}
