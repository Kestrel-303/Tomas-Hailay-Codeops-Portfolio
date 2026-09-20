import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Addis Eats - Authentic Ethiopian Culinary Experience',
  description: 'Order rich, authentic Ethiopian dishes delivered fresh to your door with Next.js App Router.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <header className="site-header">
            <Link href="/" className="brand-logo" id="nav-brand-link">
              <span className="logo-icon">🇪🇹</span>
              <span>Addis<span className="highlight">Eats</span></span>
            </Link>

            <nav>
              <ul className="nav-links">
                <li>
                  <Link href="/" className="nav-link" id="nav-home-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="nav-link" id="nav-menu-link">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="nav-link cart-link" id="nav-cart-link">
                    🛒 Cart
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className="nav-link" id="nav-checkout-link">
                    Checkout
                  </Link>
                </li>
              </ul>
            </nav>
          </header>

          <main className="main-content">{children}</main>

          <footer className="site-footer">
            <p>© {new Date().getFullYear()} Addis Eats. Built with Next.js App Router (File-system Routing & Colocated Components).</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
