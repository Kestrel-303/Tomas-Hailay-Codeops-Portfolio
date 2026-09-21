"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../lib/cart-context";

const links = [
  { href: "/home", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/home" className="brand">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          Addis Eats
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => {
            const isActive =
              pathname === link.href || (link.href === "/menu" && pathname.startsWith("/menu"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link${isActive ? " active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                {link.href === "/cart" && itemCount > 0 && <span className="nav-badge">{itemCount}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions">
          <button type="button" className="btn btn-primary" onClick={() => router.push("/checkout")}>
            Checkout
          </button>
        </div>
      </div>
    </header>
  );
}
