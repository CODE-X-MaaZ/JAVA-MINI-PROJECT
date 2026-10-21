import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getFoodListings } from '../services/api.js';
import FoodCard from '../components/FoodCard.jsx';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/ui.jsx';

export default function Listings() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('ALL'); // 'ALL' | 'AVAILABLE'

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFoodListings();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter((item) => filter === 'ALL' || item.status === filter)
      .filter((item) =>
        search.trim() === '' ||
        item.foodName?.toLowerCase().includes(search.toLowerCase())
      );
  }, [items, filter, search]);

  return (
    <div className="page">
      <div className="container">
        {/* Page header */}
        <div className="page-header">
          <h1 className="page-header__title">Available Food Listings</h1>
          <p className="page-header__subtitle">
            Browse surplus food posted by donors. Claim before the pickup deadline.
          </p>
        </div>

        {/* Filter bar */}
        {!loading && !error && (
          <div className="filter-bar" role="search">
            <label htmlFor="food-search" className="sr-only">Search food listings</label>
            <input
              id="food-search"
              type="search"
              className="filter-bar__search"
              placeholder="🔍  Search by food name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search by food name"
            />
            <div className="filter-bar__toggle" role="group" aria-label="Filter by status">
              <button
                className={`filter-btn${filter === 'ALL' ? ' filter-btn--active' : ''}`}
                onClick={() => setFilter('ALL')}
                type="button"
                aria-pressed={filter === 'ALL'}
              >
                All
              </button>
              <button
                className={`filter-btn${filter === 'AVAILABLE' ? ' filter-btn--active' : ''}`}
                onClick={() => setFilter('AVAILABLE')}
                type="button"
                aria-pressed={filter === 'AVAILABLE'}
              >
                Available only
              </button>
            </div>
            <span className="results-count" aria-live="polite">
              {filtered.length} listing{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* States */}
        {loading && <LoadingSpinner message="Loading food listings…" />}

        {!loading && error && (
          <ErrorMessage
            title="Could not load listings"
            message={error.message}
            onRetry={fetchListings}
          />
        )}

        {!loading && !error && filtered.length === 0 && items.length > 0 && (
          <EmptyState
            icon="🔍"
            title="No matches found"
            description={`No listings match "${search}". Try a different search term or clear the filter.`}
            action={
              <button className="btn btn--ghost" onClick={() => { setSearch(''); setFilter('ALL'); }} type="button">
                Clear filters
              </button>
            }
          />
        )}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            icon="📭"
            title="No food donations available yet"
            description="No surplus food has been posted. Be the first donor to help your community."
            action={<Link to="/post" className="btn btn--primary">Post Food Now</Link>}
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid--cards" aria-label="Food listings grid">
            {filtered.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
