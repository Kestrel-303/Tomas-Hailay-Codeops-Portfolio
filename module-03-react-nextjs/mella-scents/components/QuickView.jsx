'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { etb } from '@/lib/money';
import AddToBagButton from './AddToBagButton';

// "Quick View" from a product card, built on the native <dialog>. showModal() makes the rest of the
// page inert (Tab stays inside), Escape closes it, and focus goes back to the button that opened
// it. In the Vite version the button only appeared on mouse hover, so touch screens never saw it;
// here it's always visible.
export default function QuickView({ product }) {
  const dialog = useRef(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button type="button" className="product-card__quick-view" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">
        Quick View<span className="visually-hidden">: {product.title}</span>
      </button>

      <dialog
        ref={dialog}
        className="quick-view"
        aria-labelledby={`qv-title-${product.slug}`}
        // A click on the dimmed backdrop (the dialog element itself, outside the panel) closes it.
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        <div className="quick-view__panel">
          <button type="button" className="quick-view__close" onClick={close} aria-label="Close quick view">
            <span aria-hidden="true">×</span>
          </button>
          <div className="quick-view__image-wrap">
            <Image src={product.image} alt={product.title} width={1000} height={1000} sizes="(max-width: 640px) 90vw, 320px" />
          </div>
          <div className="quick-view__info">
            <p className="page-section__eyebrow">{product.brand}</p>
            <h2 id={`qv-title-${product.slug}`} className="quick-view__title">
              {product.title}
            </h2>
            <p className="quick-view__price">{etb(product.price)}</p>
            <p className="quick-view__description">{product.description}</p>
            <div className="quick-view__actions">
              <AddToBagButton product={product} />
              <Link href={`/product/${product.slug}`} className="btn" onClick={close}>
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
