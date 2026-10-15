"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { etb, relative, when } from "../../../lib/format";

// Leaflet touches `window` the moment it's imported, so the map can only exist in the browser.
// ssr: false keeps it out of the server render, and the placeholder takes the map's exact size
// so nothing below it jumps when the map arrives.
const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div className="map-frame map-placeholder" aria-hidden="true">
      Loading map…
    </div>
  ),
});

const STEPS = ["placed", "preparing", "out-for-delivery", "delivered"];
const LABELS = {
  placed: "Placed",
  preparing: "Preparing",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const FINAL = ["delivered", "cancelled"];

// What the connection indicator says. Each state has words as well as a colour.
const CONNECTION = {
  connecting: "Connecting to live updates…",
  live: "Live: updates arrive as they happen",
  reconnecting: "Connection lost, reconnecting…",
  failed: "Live updates unavailable. Reload the page to try again.",
  finished: "Updates finished: this order won't change again",
};

export default function OrderTracker({ initialOrder }) {
  // Seeded from the server render, so the status, map and text are right before the stream opens.
  const [order, setOrder] = useState(initialOrder);
  const [connection, setConnection] = useState(FINAL.includes(initialOrder.status) ? "finished" : "connecting");

  useEffect(() => {
    // A delivered or cancelled order has nothing left to stream, so no connection is opened.
    if (FINAL.includes(initialOrder.status)) return;

    const source = new EventSource(`/api/orders/${initialOrder.id}/stream`);
    const update = (event) => setOrder(JSON.parse(event.data));

    source.onopen = () => setConnection("live");
    source.addEventListener("status", update);
    source.addEventListener("position", update);
    // The server's last word: close our side on purpose. Left open, EventSource would treat the
    // server ending the stream as a dropped connection and reconnect every 3 seconds.
    source.addEventListener("done", () => {
      source.close();
      setConnection("finished");
    });
    // CONNECTING means the browser is retrying by itself; CLOSED means it gave up (a 401 or 404).
    source.onerror = () => setConnection(source.readyState === EventSource.CLOSED ? "failed" : "reconnecting");

    // Leaving the page closes the stream, so the server stops its timers for this order.
    return () => source.close();
  }, [initialOrder.id, initialOrder.status]);

  const currentStep = STEPS.indexOf(order.status);
  const { tracking } = order;

  return (
    <div className="card">
      <p className={`connection connection-${connection}`} role="status">
        <span className="connection-dot" aria-hidden="true" />
        {CONNECTION[connection]}
      </p>

      <div className="detail-row" style={{ marginBottom: "1rem" }}>
        <span className="detail-row-label">Status</span>
        <strong>{LABELS[order.status] ?? order.status}</strong>
      </div>

      {order.status === "cancelled" ? (
        <p className="page-subtitle">This order was cancelled.</p>
      ) : (
        <>
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

          <section className="delivery" aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="report-heading">Delivery</h2>
            <DeliveryMap courier={tracking.courier} destination={tracking.destination} />
            {/* Everything the map shows, in words: for screen readers, for anyone the tiles fail
                to load for, and for the moment before the map's JavaScript arrives. */}
            <dl className="delivery-text">
              <div>
                <dt>Courier</dt>
                <dd>
                  {tracking.courierPlace}
                  {tracking.kmToGo > 0 && `, about ${tracking.kmToGo} km away`}
                </dd>
              </div>
              <div>
                <dt>Delivering to</dt>
                <dd>{tracking.destination.label}</dd>
              </div>
              <div>
                <dt>Arrives</dt>
                <dd>
                  {tracking.arrivesAt
                    ? `${relative(tracking.arrivesAt, order.at)} (around ${when(tracking.arrivesAt, "time")})`
                    : "Delivered"}
                </dd>
              </div>
            </dl>
          </section>
        </>
      )}

      <ul style={{ margin: "1.25rem 0 0.5rem", paddingLeft: "1.1rem" }}>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity}
          </li>
        ))}
      </ul>
      <p style={{ fontWeight: 700 }}>Total: {etb(order.total)}</p>

      <p className="dish-category" style={{ marginTop: "1rem" }}>
        Placed {when(order.placedAt)}, {relative(order.placedAt, order.at)}
      </p>
    </div>
  );
}
