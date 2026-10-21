import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClaims } from '../services/api.js';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../components/ui.jsx';

function formatClaimedAt(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function MyClaims() {
  const [claims, setClaims]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const loadClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClaims();
      setClaims(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  return (
    <div className="page">
      <div className="container">
        {/* Page header */}
        <div className="page-header">
          <h1 className="page-header__title">My Claims</h1>
          <p className="page-header__subtitle">
            Food donations claimed and scheduled for collection.
          </p>
        </div>

        {/* States */}
        {loading && <LoadingSpinner message="Loading claims…" />}

        {!loading && error && (
          <ErrorMessage
            title="Could not load claims"
            message={error.message}
            onRetry={loadClaims}
          />
        )}

        {!loading && !error && claims.length === 0 && (
          <EmptyState
            icon="🤲"
            title="You haven't claimed any food donations yet"
            description="Browse available food listings and claim surplus food before its pickup deadline."
            action={<Link to="/listings" className="btn btn--primary">Browse Food</Link>}
          />
        )}

        {!loading && !error && claims.length > 0 && (
          <section aria-label="Claims list">
            <p className="results-count" style={{ marginBottom: 'var(--space-4)' }}>
              {claims.length} claim{claims.length !== 1 ? 's' : ''} found
            </p>
            <ol className="claims-list" aria-label="Your food claims">
              {claims.map((claim) => (
                <li key={claim.id}>
                  <article
                    className="claim-item"
                    aria-label={`Claim for ${claim.foodName ?? `Food #${claim.foodItemId}`}`}
                  >
                    <div className="claim-item__info">
                      <h2 className="claim-item__title">
                        {claim.foodName ?? `Food listing #${claim.foodItemId}`}
                      </h2>
                      <div className="claim-item__meta">
                        <span>📋 Claim #{claim.id}</span>
                        <span>👤 {claim.recipientName ?? 'Recipient'}</span>
                        <span>🕐 {formatClaimedAt(claim.claimedAt)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                      <span className="badge badge--claimed">
                        {claim.status ?? 'CLAIMED'}
                      </span>
                      {claim.foodItemId && (
                        <Link
                          to={`/listings/${claim.foodItemId}`}
                          className="btn btn--ghost btn--sm"
                          aria-label={`View listing for ${claim.foodName ?? `Food #${claim.foodItemId}`}`}
                        >
                          View listing
                        </Link>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}
