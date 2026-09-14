import { Link, Navigate } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';

function ReceiptPage() {
  const lastOrder = useOrderStore((state) => state.lastOrder);

  if (!lastOrder) {
    return <Navigate to="/menu" replace />;
  }

  return (
    <section className="checkout-page receipt-page">
      <h2>Order confirmed</h2>
      <p>Thanks, {lastOrder.customer.name}! Your order is on its way to {lastOrder.customer.area}.</p>

      <ul className="checkout-list">
        {lastOrder.items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity} — {Number(item.price) * item.quantity} ETB
          </li>
        ))}
      </ul>

      <p>Total paid: <strong>{lastOrder.total} ETB</strong></p>
      <p><small>Order {lastOrder.id} · {new Date(lastOrder.placedAt).toLocaleString()}</small></p>

      <Link to="/menu" className="primary-link">Back to menu</Link>
    </section>
  );
}

export default ReceiptPage;
