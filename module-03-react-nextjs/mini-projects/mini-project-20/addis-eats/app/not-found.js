import Link from 'next/link';
import { NO_INDEX } from '@/lib/site';

export const metadata = {
  title: 'Page not found',
  description: 'This page or dish isn’t on the Addis Eats menu. Browse the full menu or go back to the home page.',
  robots: NO_INDEX,
};

export default function NotFound() {
  return (
    <div className="state-container">
      <div className="state-icon">404 🍽️</div>
      <h1 className="state-title">Dish or Page Not Found</h1>
      <p className="state-text">
        The route or dish item you requested does not exist on the Addis Eats menu, or may have been colocated as a non-routable component.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/menu" className="btn btn-primary" id="not-found-menu-link">
          Explore Menu
        </Link>
        <Link href="/" className="btn btn-secondary" id="not-found-home-link">
          Return Home
        </Link>
      </div>
    </div>
  );
}
