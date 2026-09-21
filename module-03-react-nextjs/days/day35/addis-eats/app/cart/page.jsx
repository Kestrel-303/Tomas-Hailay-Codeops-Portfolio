"use client";

import Link from "next/link";
import { useCart } from "../../lib/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <span className="eyebrow">Cart</span>
          <h1 className="page-title">Your cart</h1>
        </div>

        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            🛒
          </span>
          <h2 style={{ fontSize: "1.1rem" }}>Your cart is empty</h2>
          <p className="page-subtitle">Head back to the menu to add a few dishes.</p>
          <Link href="/menu" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Browse the menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: "640px" }}>
      <div className="page-header">
        <span className="eyebrow">Cart</span>
        <h1 className="page-title">Your cart</h1>
      </div>

      <div className="cart-list">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-info">
              <span className="dish-name">{item.name}</span>
              <span className="dish-category">${item.price.toFixed(2)} each</span>
            </div>

            <div className="qty-control">
              <button
                type="button"
                className="qty-btn"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                aria-label={`Decrease ${item.name} quantity`}
              >
                −
              </button>
              <span className="qty-value">{item.quantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                aria-label={`Increase ${item.name} quantity`}
              >
                +
              </button>
            </div>

            <div className="cart-item-total">
              <span className="dish-price">${(item.price * item.quantity).toFixed(2)}</span>
              <button type="button" className="btn btn-ghost" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <div className="detail-row" style={{ background: "transparent", border: "none", padding: 0 }}>
          <span className="detail-row-label">Subtotal</span>
          <span style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
        </div>
        <div className="actions-row">
          <Link href="/checkout" className="btn btn-primary">
            Go to checkout
          </Link>
          <button type="button" className="btn btn-ghost" onClick={clearCart}>
            Clear cart
          </button>
        </div>
      </div>
    </div>
  );
}
