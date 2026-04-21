import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBuses } from '../utils/api';
import { useSearch } from '../context/SearchContext';
import './SearchForm.css';

const CITIES = [
  'Mumbai', 'Pune', 'Bangalore', 'Chennai', 'Delhi', 'Agra',
  'Ahmedabad', 'Nashik', 'Hyderabad', 'Kochi', 'Jaipur', 'Goa', 'Manali'
];

const SearchForm = ({ compact = false }) => {
  const navigate = useNavigate();
  const { updateSearch, updateResults } = useSearch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    source: '', destination: '',
    date: new Date().toISOString().split('T')[0]
  });

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSwap = () => {
    setForm(prev => ({ ...prev, source: prev.destination, destination: prev.source }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.source) { setError('Please select source city'); return; }
    if (!form.destination) { setError('Please select destination city'); return; }
    if (form.source === form.destination) { setError('Source and destination cannot be the same'); return; }
    if (!form.date) { setError('Please select a travel date'); return; }

    setLoading(true);
    setError('');

    try {
      updateSearch(form);
      const { data } = await searchBuses(form);
      updateResults(data.buses);
      navigate('/search');
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={`search-form ${compact ? 'compact' : ''}`} onSubmit={handleSubmit}>
      {error && <div className="alert alert-error" style={{ gridColumn: '1/-1' }}>⚠️ {error}</div>}

      <div className="search-fields">
        <div className="form-group search-field">
          <label className="form-label">From</label>
          <select name="source" className="form-select search-select" value={form.source} onChange={handleChange} required>
            <option value="">Select Source City</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button type="button" className="swap-btn" onClick={handleSwap} title="Swap cities">⇄</button>

        <div className="form-group search-field">
          <label className="form-label">To</label>
          <select name="destination" className="form-select search-select" value={form.destination} onChange={handleChange} required>
            <option value="">Select Destination City</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group search-field">
          <label className="form-label">Travel Date</label>
          <input
            type="date"
            name="date"
            className="form-input search-input"
            value={form.date}
            min={today}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary search-btn" disabled={loading}>
          {loading ? <><div className="spinner spinner-sm" /> Searching...</> : '🔍 Search Buses'}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
