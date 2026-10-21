/** Shared reusable UI components — Food Rescue Connect */

// ─── LoadingSpinner ──────────────────────────────────────────────────────────
export function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="loading-wrap" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

// ─── ErrorMessage ────────────────────────────────────────────────────────────
export function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <span className="error-box__icon" aria-hidden="true">⚠️</span>
      <div>
        <p className="error-box__title">{title}</p>
        <p className="error-box__message">{message}</p>
        {onRetry && (
          <div className="error-box__retry">
            <button className="btn btn--ghost btn--sm" onClick={onRetry} type="button">
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">{icon}</div>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__desc">{description}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const cls = status === 'AVAILABLE' ? 'badge--available' : 'badge--claimed';
  const label = status === 'AVAILABLE' ? 'Available' : 'Claimed';
  return (
    <span className={`badge ${cls}`} aria-label={`Status: ${label}`}>
      {label}
    </span>
  );
}

// ─── SuccessBanner ───────────────────────────────────────────────────────────
export function SuccessBanner({ message }) {
  return (
    <div className="success-banner" role="status" aria-live="polite">
      <span className="success-banner__icon" aria-hidden="true">✅</span>
      <p className="success-banner__text">{message}</p>
    </div>
  );
}
