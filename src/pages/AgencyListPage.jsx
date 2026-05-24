import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import AgencyCard from '../components/AgencyCard';

export default function AgencyListPage() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchAgencies = async () => {
      setLoading(true);
      try {
        const url = query ? `/api/agencies/search?q=${encodeURIComponent(query)}` : '/api/agencies';
        const { data } = await axios.get(url);
        setAgencies(data);
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, [query]);

  return (
    <main id="agency-list-page">
      <div className="page-title">
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
          {query ? `Results for "${query}"` : 'All Agencies'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          {query ? `Showing matches for your search` : 'Browse all registered medical agencies'}
        </p>
      </div>

      <div className="container" style={{ padding: '24px 24px 0' }}>
        <SearchBar />
      </div>

      <div className="container" style={{ padding: '32px 24px 60px' }}>
        {loading ? (
          <div className="loading"><div className="spinner"></div><p>Searching...</p></div>
        ) : agencies.length > 0 ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
              {agencies.length} {agencies.length === 1 ? 'agency' : 'agencies'} found
            </p>
            <div className="agencies-grid">
              {agencies.map((agency) => (
                <AgencyCard key={agency._id} agency={agency} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No agencies found</h3>
            <p>{query ? `No results for "${query}". Try a different search term.` : 'No agencies registered yet.'}</p>
          </div>
        )}
      </div>
    </main>
  );
}
