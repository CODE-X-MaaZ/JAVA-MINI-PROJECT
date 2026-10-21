import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="not-found" aria-labelledby="not-found-title">
      <div className="not-found__code" aria-hidden="true">404</div>
      <h1 id="not-found-title" className="not-found__title">Page Not Found</h1>
      <p className="not-found__desc">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn--primary btn--lg">
        Go to Home
      </Link>
    </main>
  );
}
