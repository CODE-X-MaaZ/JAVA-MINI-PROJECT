import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar    from './components/Navbar.jsx';
import Home      from './pages/Home.jsx';
import Listings  from './pages/Listings.jsx';
import FoodDetail from './pages/FoodDetail.jsx';
import PostFood  from './pages/PostFood.jsx';
import MyClaims  from './pages/MyClaims.jsx';
import NotFound  from './pages/NotFound.jsx';

/**
 * Root application component.
 * Sets up React Router v7 with a shared Navbar and all page routes.
 *
 * Routes:
 *   /              → Home
 *   /listings      → All food listings
 *   /listings/:id  → Food detail + claim action
 *   /post          → Post surplus food form
 *   /claims        → My claims
 *   *              → 404 Not Found
 */
export default function App() {
  return (
    <BrowserRouter>
      {/* Skip-to-content link for keyboard / screen-reader users */}
      <a
        href="#main-content"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        onFocus={(e) => {
          e.target.style.cssText =
            'position:fixed;top:8px;left:8px;width:auto;height:auto;padding:8px 16px;background:var(--clr-primary);color:#fff;border-radius:6px;z-index:9999;font-weight:600;';
        }}
        onBlur={(e) => {
          e.target.style.cssText =
            'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
        }}
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/listings"      element={<Listings />} />
          <Route path="/listings/:id"  element={<FoodDetail />} />
          <Route path="/post"          element={<PostFood />} />
          <Route path="/claims"        element={<MyClaims />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
