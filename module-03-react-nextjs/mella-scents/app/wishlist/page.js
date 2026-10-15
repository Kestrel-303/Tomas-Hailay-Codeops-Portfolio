import { NO_INDEX } from '@/lib/site';
import WishlistView from './WishlistView';

export const metadata = { title: 'Your Wishlist', robots: NO_INDEX };

export default function WishlistPage() {
  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">Saved</p>
      <h1 className="page-section__title">Wishlist</h1>
      <WishlistView />
    </section>
  );
}
