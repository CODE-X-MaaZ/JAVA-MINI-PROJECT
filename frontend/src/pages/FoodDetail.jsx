import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFoodById, claimFood } from '../services/api.js';
import { StatusBadge, LoadingSpinner, ErrorMessage, SuccessBanner } from '../components/ui.jsx';

function formatDeadline(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatCreatedAt(iso) {
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

const DONOR_LABELS = {
  RESTAURANT: 'Restaurant',
  HOSTEL:     'Hostel',
  CATERER:    'Caterer',
  OTHER:      'Other',
};

export default function FoodDetail() {
  const { id } = useParams();

  const [item, setItem]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const [claimed, setClaimed]   = useState(false);

  const fetchItem = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFoodById(id);
      setItem(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClaim = async () => {
    setClaiming(true);
    setClaimError(null);
    try {
      await claimFood(id);
      setClaimed(true);
      // Re-fetch to get updated status directly from the backend
      const updated = await getFoodById(id);
      setItem(updated);
    } catch (err) {
      setClaimError(err);
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return <div className="page"><div className="container"><LoadingSpinner message="Loading food details…" /></div></div>;

  if (error) {
    const isNotFound = error.status === 404;
    return (
      <div className="page">
        <div className="container">
          <Link to="/listings" className="back-link">← Back to listings</Link>
          <ErrorMessage
            title={isNotFound ? 'Listing not found' : 'Could not load listing'}
            message={isNotFound ? `No food listing with ID ${id} was found.` : error.message}
            onRetry={isNotFound ? undefined : fetchItem}
          />
        </div>
      </div>
    );
  }

  if (!item) return null;

  const isAvailable = item.status === 'AVAILABLE';

  return (
    <div className="page">
      <div className="container">
        <Link to="/listings" className="back-link" aria-label="Return to all listings">
          ← Back to listings
        </Link>

        {/* Success banner — shown only after a real successful backend claim */}
        {claimed && (
          <SuccessBanner message="🎉 Claimed successfully! The listing has been marked as claimed." />
        )}

        <div className="detail-layout">
          {/* ── Left: full details ────────────────────── */}
          <div>
            <article className="detail-card" aria-label={`Details for ${item.foodName}`}>
              <div className="detail-card__header">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: 'var(--space-3)' }}>
                  <h1 className="detail-card__title">{item.foodName}</h1>
                  <StatusBadge status={item.status} />
                </div>
                {item.description && (
                  <p className="detail-card__desc">{item.description}</p>
                )}
              </div>

              <div className="detail-meta">
                <div className="detail-meta__item">
                  <span className="detail-meta__label">Quantity</span>
                  <span className="detail-meta__value">
                    {item.quantity} {item.unit}
                  </span>
                </div>

                <div className="detail-meta__item">
                  <span className="detail-meta__label">Donor</span>
                  <span className="detail-meta__value">{item.donorName}</span>
                </div>

                <div className="detail-meta__item">
                  <span className="detail-meta__label">Donor Type</span>
                  <span className="detail-meta__value">
                    {DONOR_LABELS[item.donorType] ?? item.donorType}
                  </span>
                </div>

                <div className="detail-meta__item">
                  <span className="detail-meta__label">Pickup Location</span>
                  <span className="detail-meta__value">{item.pickupLocation}</span>
                </div>

                <div className="detail-meta__item">
                  <span className="detail-meta__label">Pickup Deadline</span>
                  <span className="detail-meta__value" style={{ color: 'var(--clr-danger)' }}>
                    ⏰ {formatDeadline(item.pickupDeadline)}
                  </span>
                </div>

                <div className="detail-meta__item">
                  <span className="detail-meta__label">Listed On</span>
                  <span className="detail-meta__value">{formatCreatedAt(item.createdAt)}</span>
                </div>
              </div>

              {/* Food safety note — per DECISIONS_AND_LIMITATIONS.md */}
              <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', lineHeight: 1.55 }}>
                ⚠️ Food Rescue Connect does not verify food safety. Confirm
                food suitability and handling directly with the donor before
                collection.
              </p>
            </article>
          </div>

          {/* ── Right: claim panel ────────────────────── */}
          <aside>
            <div className="claim-card">
              <h2 className="claim-card__title">
                {isAvailable ? '🙌 Claim this food' : '✅ Already claimed'}
              </h2>

              {/* Claim error (e.g. 409 conflict) */}
              {claimError && (
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <ErrorMessage
                    title={claimError.status === 409 ? 'Already claimed' : 'Claim failed'}
                    message={
                      claimError.status === 409
                        ? 'Someone else claimed this listing first. Please browse other available items.'
                        : claimError.message
                    }
                  />
                </div>
              )}

              {isAvailable ? (
                <>
                  <button
                    id="claim-btn"
                    className="btn btn--primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={handleClaim}
                    disabled={claiming}
                    type="button"
                    aria-busy={claiming}
                  >
                    {claiming ? '⏳ Claiming…' : '🙌 Claim Now'}
                  </button>

                  <p className="claim-card__notice">
                    ℹ️ <strong>Pickup note:</strong> Please confirm your availability before claiming.
                    Collect food directly from the designated pickup area before the deadline.
                  </p>
                </>
              ) : (
                <div style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <p>This listing has already been claimed and is no longer available.</p>
                  <Link
                    to="/listings"
                    className="btn btn--ghost"
                    style={{ marginTop: 'var(--space-4)', display: 'inline-flex' }}
                  >
                    Browse available food
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
