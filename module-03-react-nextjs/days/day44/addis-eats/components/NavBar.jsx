"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { signOut } from "../app/sign-in/actions";
import { useCart } from "../lib/cart-context";
import { fetcher } from "../lib/fetcher";

const links = [
  { href: "/home", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/search", label: "Search" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { data, mutate } = useSWR("/api/session", fetcher);
  const user = data?.user;
  // Phones only: the links and actions don't fit in one row, so they live behind a Menu button.
  // On wider screens the CSS shows everything and the button is hidden.
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  // Signing in ends with a redirect, so re-check who's signed in after every navigation, and
  // close the phone menu once a link in it has been followed.
  useEffect(() => {
    mutate();
    setMenuOpen(false);
  }, [pathname, mutate]);

  // Escape closes the open menu and puts focus back on the button that opened it, so a keyboard
  // user is never left on a link that just disappeared.
  useEffect(() => {
    if (!menuOpen) return undefined;
    function onKeyDown(event) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Showing the link to staff is convenience only; /kitchen checks the role on the server.
  const visibleLinks = user?.role === "staff" ? [...links, { href: "/kitchen", label: "Kitchen" }] : links;

  async function handleSignOut() {
    await signOut();
    await mutate({ user: null }, { revalidate: false });
    router.push("/home");
    router.refresh();
  }

  return (
    <header className="navbar" data-menu-open={menuOpen}>
      <div className="navbar-inner">
        <Link href="/home" className="brand">
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          Addis Eats
        </Link>

        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span> Menu
          {itemCount > 0 && <span className="nav-badge">{itemCount}</span>}
        </button>

        <div id="site-menu" className="nav-panel">
          <nav className="nav-links" aria-label="Primary">
            {visibleLinks.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== "/home" && pathname.startsWith(`${link.href}/`));
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
            {user ? (
              <button type="button" className="btn btn-ghost" onClick={handleSignOut}>
                Sign out {user.name}
              </button>
            ) : (
              <Link href={`/sign-in?next=${encodeURIComponent(pathname)}`} className="btn btn-ghost">
                Sign in
              </Link>
            )}
            {/* It goes somewhere, so it's a link: it can be opened in a new tab, shows its URL,
                and screen readers announce it as a link. It used to be a button calling router.push. */}
            <Link href="/checkout" className="btn btn-primary">
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
