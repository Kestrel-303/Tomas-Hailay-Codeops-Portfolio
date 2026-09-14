import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const PHONE_REGEX = /^(?:\+251|0)9\d{8}$/;
const DELIVERY_FEE = 60;
const AREAS = ["Bole", "Kazanchis", "Megenagna", "Piassa", "CMC", "Sarbet"];
const PAYMENT_METHODS = ["TeleBirr", "CBE Birr", "Cash on Delivery"];

export default function Checkout() {
  const { cartDetailed, subtotal, clearCart } = useShop();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: AREAS[0],
    payment: PAYMENT_METHODS[0],
    notes: ""
  });
  const [errors, setErrors] = useState({});

  if (cartDetailed.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Your cart is empty — add something tasty first.</p>
          <Link to="/" className="btn">Browse the Menu</Link>
        </div>
      </div>
    );
  }

  const total = subtotal + DELIVERY_FEE;

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!PHONE_REGEX.test(form.phone.trim())) {
      next.phone = "Enter a valid Ethiopian phone (e.g., 0911234567 or +251911234567).";
    }
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const order = {
      id: `AE-${Date.now().toString().slice(-6)}`,
      customer: { name: form.name.trim(), phone: form.phone.trim(), area: form.area, payment: form.payment, notes: form.notes.trim() },
      items: cartDetailed,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      date: new Date().toISOString()
    };

    clearCart();
    navigate("/order-confirmation", { state: { order } });
  }

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>

      <div className="cart-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
          />
          {errors.name && <p className="error-msg">{errors.name}</p>}

          <label htmlFor="phone">Phone (TeleBirr)</label>
          <input
            id="phone"
            type="tel"
            placeholder="0911234567"
            value={form.phone}
            onChange={e => handleChange("phone", e.target.value)}
          />
          {errors.phone && <p className="error-msg">{errors.phone}</p>}

          <label htmlFor="area">Delivery Area</label>
          <select id="area" value={form.area} onChange={e => handleChange("area", e.target.value)}>
            {AREAS.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>

          <label htmlFor="payment">Payment Method</label>
          <select id="payment" value={form.payment} onChange={e => handleChange("payment", e.target.value)}>
            {PAYMENT_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          <label htmlFor="notes">Delivery Notes (optional)</label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Gate code, landmark, extra instructions..."
            value={form.notes}
            onChange={e => handleChange("notes", e.target.value)}
          />

          <button type="submit" className="btn btn--block">Place Order</button>
        </form>

        <aside className="summary-card">
          <h2>Order Summary</h2>
          <ul className="summary-items">
            {cartDetailed.map(item => (
              <li key={item.id}>
                <span>{item.qty} × {item.name}</span>
                <span>{item.price * item.qty} ETB</span>
              </li>
            ))}
          </ul>
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
        </aside>
      </div>
    </div>
  );
}
