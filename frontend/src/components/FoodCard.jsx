import { Link } from 'react-router-dom';
import { StatusBadge } from './ui.jsx';

/**
 * Formats an ISO-8601 datetime string into a readable deadline.
 * Returns '—' if the value is missing.
 */
function formatDeadline(iso) {
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

const DONOR_TYPE_LABELS = {
  RESTAURANT: '🍽️ Restaurant',
  HOSTEL:     '🏠 Hostel',
  CATERER:    '👨‍🍳 Caterer',
  OTHER:      '🏢 Other',
};

/**
 * FoodCard — displays a summary of a food listing.
 * Clicking "View details" navigates to /listings/:id.
 */
export default function FoodCard({ item }) {
  const {
    id,
    foodName,
    description,
    quantity,
    unit,
    pickupLocation,
    pickupDeadline,
    donorName,
    donorType,
    status,
  } = item;

  return (
    <article className="card" aria-label={`Food listing: ${foodName}`}>
      <div className="card__body">
        <div className="food-card__header">
          <h2 className="food-card__title">{foodName}</h2>
          <StatusBadge status={status} />
        </div>

        {description && (
          <p className="food-card__desc" title={description}>
            {description}
          </p>
        )}

        <div className="food-card__meta">
          <div className="food-card__meta-item">
            <span className="food-card__meta-icon" aria-hidden="true">📦</span>
            <span>
              <span className="food-card__qty">
                <span className="food-card__qty-num">{quantity}</span>
                <span className="food-card__qty-unit">{unit}</span>
              </span>
            </span>
          </div>

          <div className="food-card__meta-item">
            <span className="food-card__meta-icon" aria-hidden="true">📍</span>
            <span>{pickupLocation}</span>
          </div>

          <div className="food-card__meta-item">
            <span className="food-card__meta-icon" aria-hidden="true">⏰</span>
            <span>{formatDeadline(pickupDeadline)}</span>
          </div>

          <div className="food-card__meta-item">
            <span className="food-card__meta-icon" aria-hidden="true">
              {DONOR_TYPE_LABELS[donorType] ? donorType === 'RESTAURANT' ? '🍽️' : donorType === 'HOSTEL' ? '🏠' : '👨‍🍳' : '🏢'}
            </span>
            <span>{donorName} ({DONOR_TYPE_LABELS[donorType] ?? donorType})</span>
          </div>
        </div>
      </div>

      <div className="card__footer">
        <span className="results-count">#{id}</span>
        <Link
          to={`/listings/${id}`}
          className="btn btn--primary btn--sm"
          aria-label={`View details for ${foodName}`}
        >
          View details →
        </Link>
      </div>
    </article>
  );
}
