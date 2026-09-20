"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const links = [
  { href: "/home", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

export default function NavBar() {
  const router = useRouter();

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", borderBottom: "1px solid #333" }}>
      {links.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
      <button type="button" onClick={() => router.push("/checkout")}>
        Quick checkout
      </button>
    </nav>
  );
}
