import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const linkClass = ({ isActive }) =>
    isActive ? 'navbar__link navbar__link--active' : 'navbar__link';

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="container navbar__inner">
        {/* Brand */}
        <Link to="/" className="navbar__brand" onClick={close} aria-label="Food Rescue Connect home">
          <span className="navbar__brand-icon" aria-hidden="true">🥗</span>
          <span>Food Rescue Connect</span>
        </Link>

        {/* Desktop links */}
        <ul className={`navbar__links${open ? ' navbar__links--open' : ''}`} role="list">
          <li>
            <NavLink to="/listings" className={linkClass} onClick={close}>
              Browse Food
            </NavLink>
          </li>
          <li>
            <NavLink to="/claims" className={linkClass} onClick={close}>
              My Claims
            </NavLink>
          </li>
          <li>
            <Link to="/post" className="navbar__cta" onClick={close}>
              + Post Food
            </Link>
          </li>
        </ul>

        {/* Hamburger (mobile) */}
        <button
          className="navbar__hamburger"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((prev) => !prev)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
