import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const DELIVERY_FEE = 60;

export default function Cart() {
  const { cartDetailed, updateQty, removeFromCart, subtotal } = useShop();
  const navigate = useNavigate();

  if (cartDetailed.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn">Browse the Menu</Link>
        </div>
      </div>
    );
  }

  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="page">
      <h1 className="page-title">Your Cart</h1>

      <div className="cart-layout">
        <ul className="cart-list">
          {cartDetailed.map(item => (
            <li key={item.id} className="cart-item">
              <div className="cart-item__media" style={{ background: item.color }}>
                <span>{item.emoji}</span>
              </div>
              <div className="cart-item__info">
                <Link to={`/dish/${item.id}`}>
                  <strong>{item.name}</strong>
                </Link>
                <p className="price">{item.price} ETB</p>
              </div>
              <div className="qty-stepper">
                <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease quantity">−</button>
                <span>{item.qty}</span>
                <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase quantity">+</button>
              </div>
              <p className="line-total">{item.price * item.qty} ETB</p>
              <button type="button" className="remove-btn" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <aside className="summary-card">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{subtotal} ETB</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{DELIVERY_FEE} ETB</span>
          </div>
          <div className="summary-row summary-row--total">
            <span>Total</span>
            <span>{total} ETB</span>
          </div>
          <button type="button" className="btn btn--block" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
}
