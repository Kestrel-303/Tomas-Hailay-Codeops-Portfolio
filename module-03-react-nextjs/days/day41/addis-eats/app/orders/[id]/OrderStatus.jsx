"use client";

import useSWR from "swr";
import { fetcher } from "../../../lib/fetcher";
import { formatETB } from "../../../lib/money";

const STEPS = ["placed", "preparing", "out-for-delivery", "delivered"];
const LABELS = {
  placed: "Placed",
  preparing: "Preparing",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const POLL_MS = 5000;

// No useEffect, no useState: SWR owns the request, the data, the error and the polling.
export default function OrderStatus({ orderId, fallbackData }) {
  const { data: order, error, isValidating } = useSWR(`/api/orders/${orderId}`, fetcher, {
    fallbackData,
    // Poll every 5s until the order can't change any more, then stop.
    refreshInterval: (latest) =>
      latest && (latest.status === "delivered" || latest.status === "cancelled") ? 0 : POLL_MS,
  });

  const currentStep = STEPS.indexOf(order.status);

  return (
    <div className="card">
      <div className="detail-row" style={{ marginBottom: "1rem" }}>
        <span className="detail-row-label">Status</span>
        <strong>{LABELS[order.status] ?? order.status}</strong>
      </div>

      {order.status === "cancelled" ? (
        <p className="page-subtitle">This order was cancelled.</p>
      ) : (
        <ol className="status-steps">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className={`status-step${index < currentStep ? " done" : ""}${index === currentStep ? " current" : ""}`}
            >
              {LABELS[step]}
            </li>
          ))}
        </ol>
      )}

      <ul style={{ margin: "1.25rem 0 0.5rem", paddingLeft: "1.1rem" }}>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <p style={{ fontWeight: 700 }}>Total: {formatETB(order.total)}</p>

      <p className="dish-category" style={{ marginTop: "1rem" }}>
        {isValidating ? "Checking for updates…" : `Placed ${new Date(order.placedAt).toLocaleTimeString()}`}
      </p>
      {error && (
        <p role="alert" className="form-error">
          Couldn&apos;t refresh the status: {error.message}
        </p>
      )}
    </div>
  );
}
