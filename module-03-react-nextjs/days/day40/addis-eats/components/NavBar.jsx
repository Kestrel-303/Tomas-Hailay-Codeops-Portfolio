"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
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

  // Signing in ends with a redirect, so re-check who's signed in after every navigation.
  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  // Showing the link to staff is convenience only; /kitchen checks the role on the server.
  const visibleLinks = user?.role === "staff" ? [...links, { href: "/kitchen", label: "Kitchen" }] : links;

  async function handleSignOut() {
    await signOut();
    await mutate({ user: null }, { revalidate: false });
    router.push("/home");
    router.refresh();
  }

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
          <button type="button" className="btn btn-primary" onClick={() => router.push("/checkout")}>
            Checkout
          </button>
        </div>
      </div>
    </header>
  );
}
