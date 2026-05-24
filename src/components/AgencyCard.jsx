import { useNavigate } from 'react-router-dom';

export default function AgencyCard({ agency }) {
  const navigate = useNavigate();

  return (
    <div className="agency-card" onClick={() => navigate(`/agencies/${agency._id}`)} id={`agency-card-${agency._id}`}>
      <div className="card-icon">🏥</div>
      <h3>{agency.agencyName}</h3>
      <div className="card-info">
        <span>📍 {agency.address}</span>
        <span>📞 {agency.phone}</span>
        {agency.description && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{agency.description}</span>}
      </div>
      <div className="card-actions">
        <a href={`tel:${agency.phone}`} className="btn btn-call btn-sm" onClick={(e) => e.stopPropagation()}>
          📞 Call Now
        </a>
        <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/agencies/${agency._id}`); }}>
          View Details
        </button>
      </div>
    </div>
  );
}
