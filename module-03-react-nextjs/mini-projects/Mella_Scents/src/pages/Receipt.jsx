import { Link, Navigate, useLocation } from "react-router-dom";

export default function Receipt() {
  const location = useLocation();
  const order = location.state?.order;
  const total = location.state?.total;

  if (!order) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">Order Confirmed</p>
      <h1 className="page-section__title">Thank You, {order.name}</h1>
      <p className="page-section__body">
        Your order is on its way to {order.area}, Addis Ababa. A TeleBirr confirmation has been
        sent to {order.phone}.
      </p>
      <p className="page-section__body">
        <strong>Total Paid:</strong> ETB {total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </p>
      <Link to="/shop" className="btn btn-solid" style={{ marginTop: "1.5rem" }}>
        Continue Shopping
      </Link>
    </section>
  );
}
