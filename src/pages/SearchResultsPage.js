import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import BusCard from '../components/BusCard';
import Spinner from '../components/Spinner';
import { useSearch } from '../context/SearchContext';
import { searchBuses } from '../utils/api';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const { searchParams, searchResults, hasSearched, updateResults } = useSearch();
  const [loading, setLoading] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ busType: '', sortBy: 'rating', maxPrice: '' });

  useEffect(() => {
    if (!hasSearched && !searchParams.source) navigate('/');
  }, [hasSearched, searchParams, navigate]);

  useEffect(() => {
    let result = [...searchResults];
    if (filters.busType) result = result.filter(b => b.busType === filters.busType);
    if (filters.maxPrice) result = result.filter(b => b.price <= Number(filters.maxPrice));
    if (filters.sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (filters.sortBy === 'departure') result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    else result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setFiltered(result);
  }, [searchResults, filters]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data } = await searchBuses(searchParams);
      updateResults(data.buses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const busTypes = ['AC Sleeper', 'AC Seater', 'Semi-Sleeper', 'Sleeper', 'Seater'];

  return (
    <div className="search-results-page">
      {/* Top search bar */}
      <section className="search-bar-section">
        <div className="container">
          <SearchForm compact />
        </div>
      </section>

      <div className="container results-layout">
        {/* Sidebar Filters */}
        <aside className="filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button
              className="clear-btn"
              onClick={() => setFilters({ busType: '', sortBy: 'rating', maxPrice: '' })}
            >
              Clear All
            </button>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <div className="radio-group">
              {[
                { val: 'rating', label: '⭐ Top Rated' },
                { val: 'price_asc', label: '💰 Price: Low to High' },
                { val: 'price_desc', label: '💎 Price: High to Low' },
                { val: 'departure', label: '🕐 Earliest Departure' }
              ].map(opt => (
                <label key={opt.val} className="radio-item">
                  <input type="radio" name="sortBy" value={opt.val} checked={filters.sortBy === opt.val} onChange={handleFilterChange} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Bus Type</label>
            <div className="checkbox-group">
              <label className="radio-item">
                <input type="radio" name="busType" value="" checked={filters.busType === ''} onChange={handleFilterChange} />
                All Types
              </label>
              {busTypes.map(t => (
                <label key={t} className="radio-item">
                  <input type="radio" name="busType" value={t} checked={filters.busType === t} onChange={handleFilterChange} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Max Price (₹)</label>
            <input
              type="number"
              name="maxPrice"
              className="form-input"
              placeholder="e.g. 1000"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              min="0"
            />
          </div>
        </aside>

        {/* Results */}
        <main className="results-main">
          {searchParams.source && (
            <div className="results-header">
              <div>
                <h2 className="results-title">
                  {searchParams.source} → {searchParams.destination}
                </h2>
                <p className="results-meta">
                  {searchParams.date
                    ? new Date(searchParams.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Any Date'}
                  {' · '}
                  <span className="results-count">{filtered.length} buses found</span>
                </p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={handleRefresh} disabled={loading}>
                🔄 Refresh
              </button>
            </div>
          )}

          {loading ? (
            <Spinner text="Finding best buses for you..." />
          ) : filtered.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🚌</div>
              <h3>No buses found</h3>
              <p>Try adjusting your filters or search for a different route.</p>
              <button className="btn btn-primary" onClick={() => setFilters({ busType: '', sortBy: 'rating', maxPrice: '' })}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="bus-list">
              {filtered.map((bus, i) => (
                <div key={bus._id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <BusCard bus={bus} searchDate={searchParams.date} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResultsPage;
