'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useShop } from './ShopProvider';

const NAV = [
  { href: '/', label: 'Home', match: (p) => p === '/' },
  { href: '/shop', label: 'Shop', match: (p) => p === '/shop' || p.startsWith('/product/') },
  { href: '/about', label: 'About', match: (p) => p === '/about' },
];

// Client because it shows the bag and wishlist counts and who's signed in, and opens the phone
// menu. On narrow screens the links move behind a Menu button: Escape closes it and returns focus
// to the button, and following a link closes it too.
export default function Header() {
  const pathname = usePathname();
  const { bagCount, wishlist, user, refreshSession } = useShop();
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);

  useEffect(() => {
    setOpen(false);
    refreshSession(); // signing in or out ends in a navigation
  }, [pathname, refreshSession]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      toggle.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const count = (n, one, many) => (n > 0 ? <span className="site-header__badge" aria-label={`${n} ${n === 1 ? one : many}`}>{n}</span> : null);

  return (
    <header className="site-header" data-menu-open={open}>
      <div className="container site-header__row">
        <Link href="/" className="site-header__logo">
          Mella&nbsp;Scents
        </Link>

        <button
          ref={toggle}
          type="button"
          className="site-header__toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true">{open ? '✕' : '☰'}</span> Menu
        </button>

        <div id="site-menu" className="site-header__menu">
          <nav className="site-header__nav" aria-label="Main">
            <ul>
              {NAV.map((link) => {
                const active = link.match(pathname);
                return (
                  <li key={link.href}>
                    <Link href={link.href} className={`site-header__link${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="site-header__actions">
            <Link href="/wishlist" className="site-header__icon" aria-current={pathname === '/wishlist' ? 'page' : undefined}>
              <span aria-hidden="true">♡</span>
              <span className="site-header__icon-label">Wishlist</span>
              {count(wishlist.length, 'saved fragrance', 'saved fragrances')}
            </Link>
            <Link href="/cart" className="site-header__icon" aria-current={pathname === '/cart' ? 'page' : undefined}>
              <span aria-hidden="true">🛍</span>
              <span className="site-header__icon-label">Bag</span>
              {count(bagCount, 'item', 'items')}
            </Link>
            <Link href={user ? '/account' : `/login?next=${encodeURIComponent(pathname)}`} className="site-header__account">
              {user ? user.name : 'Sign In'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
