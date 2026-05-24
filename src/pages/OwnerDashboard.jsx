import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyAgencies = async () => {
      try {
        const { data } = await axios.get('/api/agencies/owner/mine');
        setAgencies(data);
      } catch (err) {
        console.error('Failed to fetch agencies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyAgencies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agency?')) return;
    try {
      await axios.delete(`/api/agencies/${id}`);
      setAgencies((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert('Failed to delete agency');
    }
  };

  return (
    <main className="dashboard" id="owner-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}</p>
        </div>
        <Link to="/manage-agency" className="btn btn-primary" id="add-agency-btn">
          + Add New Agency
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Total Agencies</div>
          <div className="stat-value">{agencies.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Account Type</div>
          <div className="stat-value" style={{ fontSize: '1.2rem', textTransform: 'capitalize' }}>{user?.role}</div>
        </div>
      </div>

      <div className="section-header">
        <h2>Your Agencies</h2>
        <p>Manage your registered medical agencies</p>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div><p>Loading...</p></div>
      ) : agencies.length > 0 ? (
        <div className="agencies-grid">
          {agencies.map((agency) => (
            <div key={agency._id} className="agency-card" id={`dash-agency-${agency._id}`}>
              <div className="card-icon">🏥</div>
              <h3>{agency.agencyName}</h3>
              <div className="card-info">
                <span>📍 {agency.address}</span>
                <span>📞 {agency.phone}</span>
              </div>
              <div className="card-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/manage-agency/${agency._id}`)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(agency._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🏥</div>
          <h3>No agencies yet</h3>
          <p>Start by adding your first medical agency</p>
          <Link to="/manage-agency" className="btn btn-primary" style={{ marginTop: '16px' }}>
            + Add Agency
          </Link>
        </div>
      )}
    </main>
  );
}
