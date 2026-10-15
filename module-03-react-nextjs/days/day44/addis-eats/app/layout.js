import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import NavBar from "../components/NavBar";
import Providers from "../components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The heading font. next/font downloads it at build time and serves it from our own origin
// (no request to fonts.googleapis.com), preloads it, and sizes the Georgia fallback to match
// Fraunces' metrics, so swapping fonts doesn't move the text.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata = {
  title: "Addis Eats",
  description: "Authentic Ethiopian cuisine delivered to your doorstep.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable}`}>
      <body>
        <Providers>
          {/* The first Tab stop on every page: jumps past the header's links straight to the
              content. Hidden until it has keyboard focus. */}
          <a href="#main" className="skip-link">
            Skip to main content
          </a>
          {/* NavBar renders the one <header> itself. */}
          <NavBar />
          {/* tabIndex -1 lets the skip link move focus here (not only scroll), so the next Tab
              continues from the content. */}
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          {/* Third-party confetti for "added to cart". Nothing on first paint needs it, so it loads
              once the browser is idle instead of blocking the page in <head>. */}
          <Script
            src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"
            strategy="lazyOnload"
          />
          <footer style={{ borderTop: "1px solid var(--border)", padding: "1.5rem", textAlign: "center", marginTop: "auto", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <p>&copy; {new Date().getFullYear()} Addis Eats. All rights reserved.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

