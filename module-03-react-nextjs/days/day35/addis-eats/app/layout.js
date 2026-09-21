import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "../components/NavBar";
import { CartProvider } from "../lib/cart-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Addis Eats",
  description: "Next.js App Router routing exercise",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CartProvider>
          <header>
            <NavBar />
          </header>
          <main>{children}</main>
          <footer style={{ borderTop: "1px solid var(--border)", padding: "1.5rem", textAlign: "center", marginTop: "auto", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <p>&copy; {new Date().getFullYear()} Addis Eats. All rights reserved.</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
