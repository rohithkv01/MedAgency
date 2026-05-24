import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function AgencyDetailsPage() {
  const { id } = useParams();
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgency = async () => {
      try {
        const { data } = await axios.get(`/api/agencies/${id}`);
        setAgency(data);
      } catch (err) {
        setError('Agency not found');
      } finally {
        setLoading(false);
      }
    };
    fetchAgency();
  }, [id]);

  if (loading) return <div className="loading" style={{ marginTop: '80px' }}><div className="spinner"></div><p>Loading...</p></div>;
  if (error) return <div className="details-page"><div className="alert alert-error">{error}</div><Link to="/agencies" className="btn btn-secondary">← Back to Agencies</Link></div>;

  return (
    <main className="details-page" id="agency-details-page">
      <Link to="/agencies" className="back-link">← Back to Agencies</Link>

      <div className="details-header">
        <h1>{agency.agencyName}</h1>
        <p className="tagline">Trusted Medical Distribution Partner</p>
      </div>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div className="details-info">
          <div className="info-row">
            <div className="info-icon">📞</div>
            <div>
              <div className="info-label">Phone Number</div>
              <div className="info-value">{agency.phone}</div>
            </div>
          </div>
          <div className="info-row">
            <div className="info-icon">📍</div>
            <div>
              <div className="info-label">Address</div>
              <div className="info-value">{agency.address}</div>
            </div>
          </div>
          {agency.description && (
            <div className="info-row">
              <div className="info-icon">📋</div>
              <div>
                <div className="info-label">Description</div>
                <div className="info-value">{agency.description}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <a href={`tel:${agency.phone}`} className="btn btn-call btn-lg" id="call-now-btn">
          📞 Call Now
        </a>
        <Link to="/agencies" className="btn btn-secondary btn-lg">
          Browse More Agencies
        </Link>
      </div>
    </main>
  );
}
