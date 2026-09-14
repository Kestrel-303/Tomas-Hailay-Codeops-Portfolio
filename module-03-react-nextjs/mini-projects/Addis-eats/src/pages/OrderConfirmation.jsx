import { Link, Navigate, useLocation } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page">
      <div className="confirmation-card">
        <span className="confirmation-icon">✅</span>
        <h1>Thank you, {order.customer.name}!</h1>
        <p className="success-msg">Order {order.id} has been placed successfully.</p>
        <p>
          We'll deliver to <strong>{order.customer.area}</strong> and reach you at{" "}
          <strong>{order.customer.phone}</strong>. Pay via <strong>{order.customer.payment}</strong>.
        </p>

        <ul className="summary-items">
          {order.items.map(item => (
            <li key={item.id}>
              <span>{item.qty} × {item.name}</span>
              <span>{item.price * item.qty} ETB</span>
            </li>
          ))}
        </ul>

        <div className="summary-row summary-row--total">
          <span>Total Paid</span>
          <span>{order.total} ETB</span>
        </div>

        <Link to="/" className="btn">Back to Menu</Link>
      </div>
    </div>
  );
}
