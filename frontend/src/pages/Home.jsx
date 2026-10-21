import { Link } from 'react-router-dom';

export default function Home() {
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

      {/* ── Stats strip ───────────────────────────────────── */}
      <div className="stats-strip" aria-label="Platform highlights">
        <div className="stats-strip__inner">
          <div className="stat">
            <div className="stat__num">🏪</div>
            <div className="stat__label">Restaurants &amp; Hostels</div>
          </div>
          <div className="stat">
            <div className="stat__num">🥘</div>
            <div className="stat__label">Surplus Listings</div>
          </div>
          <div className="stat">
            <div className="stat__num">🤝</div>
            <div className="stat__label">Claims Made</div>
          </div>
          <div className="stat">
            <div className="stat__num">♻️</div>
            <div className="stat__label">Less Food Wasted</div>
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
