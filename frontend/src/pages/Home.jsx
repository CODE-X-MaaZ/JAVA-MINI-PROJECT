import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFoodListings, getClaims, getActivityHistory } from '../services/api.js';

export default function Home() {
  const [stats, setStats] = useState({
    totalListings: 8,
    availableListings: 6,
    totalMealPortions: 121,
    claimsMade: 2,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getFoodListings(),
      getClaims(),
      getActivityHistory(),
    ])
      .then(([items, claims, historyEvents]) => {
        if (!isMounted) return;
        const list = Array.isArray(items) ? items : [];
        const available = list.filter((i) => i.status === 'AVAILABLE');
        const actualClaims = Array.isArray(claims) ? claims : [];
        setStats({
          totalListings: list.length,
          availableListings: available.length,
          totalMealPortions: available.reduce((s, i) => s + Number(i.quantity || 0), 0),
          claimsMade: actualClaims.length,
        });
        setHistory(Array.isArray(historyEvents) ? historyEvents : []);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main id="main-content">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="container">
          <span className="hero-section__tag">🌱 Reduce Food Waste</span>
          <h1 id="hero-title" className="hero-section__title">
            Connect Surplus Food<br />
            with Those Who Need It <span>Most</span>
          </h1>
          <p className="hero-section__subtitle">
            Restaurants, hostels, and caterers post surplus food. NGOs and
            recipients claim it before the pickup deadline. Simple, fast, and
            free.
          </p>
          <div className="hero-section__actions">
            <Link to="/listings" className="hero-section__btn hero-section__btn--white">
              🍱 Browse Food
            </Link>
            <Link to="/post" className="hero-section__btn hero-section__btn--outline">
              + Post Surplus Food
            </Link>
          </div>
        </div>
      </section>

      {/* ── Dashboard Stats Strip ─────────────────────────── */}
      <div className="stats-strip" aria-label="Platform highlights">
        <div className="stats-strip__inner">
          <div className="stat">
            <div className="stat__num">
              {loading ? '…' : stats.totalListings}
            </div>
            <div className="stat__label">Total Listings</div>
          </div>
          <div className="stat">
            <div className="stat__num">
              {loading ? '…' : stats.availableListings}
            </div>
            <div className="stat__label">Available Now</div>
          </div>
          <div className="stat">
            <div className="stat__num">
              {loading ? '…' : stats.totalMealPortions}
            </div>
            <div className="stat__label">Portions Available</div>
          </div>
          <div className="stat">
            <div className="stat__num">
              {loading ? '…' : stats.claimsMade}
            </div>
            <div className="stat__label">Claims Made</div>
          </div>
        </div>
      </div>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="how-section" aria-labelledby="how-title">
        <div className="container">
          <h2 id="how-title" className="how-section__title">How It Works</h2>
          <div className="how-grid">
            <div className="how-step">
              <div className="how-step__icon" aria-hidden="true">📝</div>
              <h3 className="how-step__title">1. Post Surplus Food</h3>
              <p className="how-step__desc">
                Donors fill in a quick form — food name, quantity, pickup
                location, and a pickup deadline.
              </p>
            </div>
            <div className="how-step">
              <div className="how-step__icon" aria-hidden="true">🔍</div>
              <h3 className="how-step__title">2. Browse Listings</h3>
              <p className="how-step__desc">
                Recipients see all available listings. Search by name or filter
                by availability in real time.
              </p>
            </div>
            <div className="how-step">
              <div className="how-step__icon" aria-hidden="true">🙌</div>
              <h3 className="how-step__title">3. Claim &amp; Collect</h3>
              <p className="how-step__desc">
                One click claims a listing. The backend marks it immediately so
                no two recipients claim the same food.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent Activity / History ─────────────────────── */}
      {history.length > 0 && (
        <section
          style={{
            padding: 'var(--space-12) var(--space-6)',
            background: 'var(--clr-surface)',
            borderTop: '1px solid var(--clr-border)',
          }}
          aria-labelledby="activity-title"
        >
          <div className="container" style={{ maxWidth: 860 }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <h2 id="activity-title" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
                Recent Rescue Activity
              </h2>
              <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.95rem' }}>
                Latest food donations posted and claims coordinated across the community.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {history.map((event) => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-4) var(--space-6)',
                    background: 'var(--clr-bg)',
                    border: '1px solid var(--clr-border)',
                    borderRadius: 'var(--radius-md)',
                    gap: 'var(--space-4)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <span style={{ fontSize: '1.5rem', lineHeight: 1 }} aria-hidden="true">
                      {event.type === 'CLAIMED' ? '🤝' : '🍲'}
                    </span>
                    <div>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 2px 0' }}>
                        {event.title}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', margin: 0 }}>
                        {event.description}
                      </p>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <span className={`badge ${event.type === 'CLAIMED' ? 'badge--claimed' : 'badge--available'}`}>
                      {event.type === 'CLAIMED' ? 'Claimed' : 'Listed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA footer strip ──────────────────────────────── */}
      <section
        style={{
          background: 'var(--clr-primary-light)',
          padding: 'var(--space-12) var(--space-6)',
          textAlign: 'center',
          borderTop: '1px solid var(--clr-border)',
        }}
        aria-labelledby="cta-title"
      >
        <div className="container">
          <h2 id="cta-title" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
            Ready to reduce food waste?
          </h2>
          <p style={{ color: 'var(--clr-text-muted)', marginBottom: 'var(--space-6)' }}>
            Post your surplus today or browse what is available near your
            campus.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/listings" className="btn btn--primary btn--lg">Browse Listings</Link>
            <Link to="/post" className="btn btn--ghost btn--lg">Post Food</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
