import Link from 'next/link';

// Server component: nothing in it changes per visitor.
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__row">
        <p className="site-footer__brand">Mella Scents</p>
        <nav aria-label="Footer" className="site-footer__links">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/account">Account</Link>
        </nav>
        <p className="site-footer__note">
          &copy; {new Date().getFullYear()} Mella Scents, Addis Ababa. Crafted fragrances, quietly luxurious. Product data and photos:{' '}
          <a href="https://dummyjson.com">DummyJSON</a>.
        </p>
      </div>
    </footer>
  );
}
