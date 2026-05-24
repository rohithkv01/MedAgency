import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ManageAgency() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ agencyName: '', phone: '', address: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchAgency = async () => {
        try {
          const { data } = await axios.get(`/api/agencies/${id}`);
          setForm({
            agencyName: data.agencyName,
            phone: data.phone,
            address: data.address,
            description: data.description || '',
          });
        } catch (err) {
          setError('Failed to load agency details');
        } finally {
          setFetching(false);
        }
      };
      fetchAgency();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.agencyName || !form.phone || !form.address) {
      setError('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/agencies/${id}`, form);
        setSuccess('Agency updated successfully!');
      } else {
        await axios.post('/api/agencies', form);
        setSuccess('Agency created successfully!');
      }
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading" style={{ marginTop: '80px' }}><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <main className="auth-page" id="manage-agency-page">
      <div className="auth-card" style={{ maxWidth: '560px' }}>
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h2>{isEdit ? 'Edit Agency' : 'Add New Agency'}</h2>
        <p className="subtitle">{isEdit ? 'Update your agency details' : 'Register your medical agency'}</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} id="agency-form">
          <div className="form-group">
            <label htmlFor="agencyName">Agency Name *</label>
            <input type="text" id="agencyName" name="agencyName" className="form-input"
              placeholder="e.g. Sai Srinivasa Medical Agency"
              value={form.agencyName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input type="tel" id="phone" name="phone" className="form-input"
              placeholder="+91 9876543210"
              value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input type="text" id="address" name="address" className="form-input"
              placeholder="Full address of the agency"
              value={form.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea id="description" name="description" className="form-input"
              placeholder="Brief description of your agency..."
              value={form.description} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading} id="agency-submit">
              {loading ? 'Saving...' : isEdit ? 'Update Agency' : 'Create Agency'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
