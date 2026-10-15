import { NO_INDEX } from '@/lib/site';
import CartView from './CartView';

export const metadata = { title: 'Your Bag', robots: NO_INDEX };

// A static shell: the bag belongs to this browser, so its lines render on the client.
export default function CartPage() {
  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">Your Bag</p>
      <h1 className="page-section__title">Bag</h1>
      <CartView />
    </section>
  );
}
