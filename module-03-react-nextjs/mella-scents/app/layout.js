import { Cormorant_Garamond, Jost } from 'next/font/google';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ShopProvider } from '@/components/ShopProvider';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

// next/font downloads both fonts at build time and serves them from this site: no request to
// Google when a page loads, and no layout shift when the fonts swap in. (The Vite version linked
// the Google Fonts stylesheet from <head>, which blocked rendering.)
const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-display' });
const body = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-body' });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Mella Scents · Luxury Perfumes in Addis Ababa', template: '%s · Mella Scents' },
  description: 'Minimal bottles, maximal presence. Designer fragrances from Chanel, Dior, Gucci and more, delivered across Addis Ababa and paid with TeleBirr.',
  icons: { icon: '/favicon.svg' },
  // og:image and twitter:image come from app/opengraph-image.js.
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_ET' },
  twitter: { card: 'summary_large_image' },
};

export const viewport = { themeColor: '#faebd7' };

// Server component. It reads no cookies or headers (that would make every page dynamic); the
// signed-in name in the header comes from /api/session, fetched by ShopProvider.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <ShopProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <div className="app-shell">
            <Header />
            {/* tabIndex -1 lets the skip link move focus here, so the next Tab starts in the content. */}
            <main id="main" className="app-main" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </ShopProvider>
      </body>
    </html>
  );
}
