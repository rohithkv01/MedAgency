import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (value) => {
    if (!value.trim()) { setSuggestions([]); return; }
    try {
      const { data } = await axios.get(`/api/agencies/search?q=${encodeURIComponent(value)}`);
      setSuggestions(data);
      setShowSuggestions(true);
      setActiveIndex(-1);
    } catch { setSuggestions([]); }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 250);
  };

  const handleSelect = (agency) => {
    setQuery(agency.agencyName);
    setShowSuggestions(false);
    navigate(`/agencies/${agency._id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
    } else if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/agencies?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="search-wrapper" ref={wrapperRef} id="search-wrapper">
      <form className="search-bar" onSubmit={handleSubmit} id="search-form">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search medical agencies..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          id="search-input"
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions" id="suggestions-dropdown">
          {suggestions.map((agency, index) => (
            <div
              key={agency._id}
              className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleSelect(agency)}
            >
              <div>
                <div className="name">{agency.agencyName}</div>
                <div className="addr">{agency.address}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
