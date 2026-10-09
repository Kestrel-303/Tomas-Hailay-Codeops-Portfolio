import { Outfit } from 'next/font/google';
import Link from 'next/link';
import Script from 'next/script';
import Providers from './Providers';
import AuthNav from './AuthNav';
import CartNavLink from './CartNavLink';
import './globals.css';

// The site font, replacing a Google Fonts @import in globals.css. next/font downloads it at build
// time and serves it from our own origin, so there's no render-blocking stylesheet chain to
// fonts.googleapis.com, and it sizes the fallback to Outfit's metrics, so the swap doesn't move
// text. Outfit is a variable font, so one file covers every weight from 300 to 800.
const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Addis Eats - Authentic Ethiopian Culinary Experience',
  description: 'Order rich, authentic Ethiopian dishes delivered fresh to your door with Next.js App Router.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <Providers>
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
                    <CartNavLink />
                  </li>
                  <li>
                    <Link href="/checkout" className="nav-link" id="nav-checkout-link">
                      Checkout
                    </Link>
                  </li>
                  <AuthNav />
                </ul>
              </nav>
            </header>

            <main className="main-content">{children}</main>

            <footer className="site-footer">
              <p>© {new Date().getFullYear()} Addis Eats. Built with Next.js App Router (File-system Routing & Colocated Components).</p>
            </footer>
          </div>
        </Providers>
        {/* Third-party confetti for "Add to Cart". Nothing on first paint needs it, so it loads once
            the browser is idle instead of blocking the page from <head>. */}
        <Script
          src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
