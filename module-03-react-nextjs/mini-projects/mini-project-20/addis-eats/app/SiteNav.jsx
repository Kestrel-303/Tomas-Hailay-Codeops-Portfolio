'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// The header's links. On a phone they don't fit in one row (Cart, Checkout, Orders and Sign in
// ended up off-screen), so below 760px they sit behind a Menu button. Escape closes the panel and
// returns focus to that button; following a link closes it too. Wider screens never see the
// button and get the plain row.
export default function SiteNav({ children }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <nav className="site-nav" aria-label="Main" data-open={open}>
      <button
        ref={buttonRef}
        type="button"
        className="site-nav-toggle"
        aria-expanded={open}
        aria-controls="site-nav-links"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? '✕' : '☰'}</span> Menu
      </button>
      <div id="site-nav-links" className="site-nav-panel">
        {children}
      </div>
    </nav>
  );
}
