'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { etb, relative, when } from '@/lib/format';
import { STATUS_LABELS, STEPS, statusBadgeClass } from './status';

// Leaflet reads `window` the moment it's imported, so the map can only exist in the browser:
// ssr: false. The placeholder uses the same .tracking-map box (an explicit 360px height) as the
// real map, so the page doesn't move when the map's code arrives.
const DeliveryMap = dynamic(() => import('./DeliveryMap'), {
  ssr: false,
  loading: () => (
    <div className="tracking-map tracking-map-placeholder" aria-hidden="true">
      Loading map…
    </div>
  ),
});

const FINAL = ['delivered', 'cancelled'];

// The connection state, always shown as words. The coloured dot only repeats them.
const CONNECTION = {
  connecting: 'Connecting to live updates…',
  live: 'Live: updates arrive by themselves',
  reconnecting: 'Connection dropped, reconnecting…',
  failed: 'Live updates stopped. Reload the page to try again.',
  finished: 'Finished: this order won’t change again',
};

export default function OrderTracker({ initialOrder }) {
  // Seeded with the server's snapshot, so the first paint is already right.
  const [order, setOrder] = useState(initialOrder);
  const [connection, setConnection] = useState(FINAL.includes(initialOrder.status) ? 'finished' : 'connecting');

  useEffect(() => {
    // Delivered or cancelled already: nothing will change, so no connection is opened at all.
    if (FINAL.includes(initialOrder.status)) return undefined;

    const source = new EventSource(`/api/orders/${encodeURIComponent(initialOrder.id)}/stream`);
    const update = (event) => setOrder(JSON.parse(event.data));

    source.onopen = () => setConnection('live');
    source.addEventListener('status', update);
    source.addEventListener('position', update);
    // The server's last message. Close our side on purpose: when a server ends a stream,
    // EventSource treats it as a dropped line and reconnects every 3 s unless told otherwise.
    source.addEventListener('done', () => {
      source.close();
      setConnection('finished');
    });
    // readyState CONNECTING after an error means the browser is retrying by itself; CLOSED means
    // it gave up (for example on a 401 or 404).
    source.onerror = () => setConnection(source.readyState === EventSource.CLOSED ? 'failed' : 'reconnecting');

    // Unmount (navigating away) closes the connection, and the server stops its timers.
    return () => source.close();
  }, [initialOrder.id, initialOrder.status]);

  const currentStep = STEPS.indexOf(order.status);
  const { tracking } = order;

  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div className="tracking-head">
        <span className={`badge ${statusBadgeClass(order.status)}`}>{STATUS_LABELS[order.status] ?? order.status}</span>
        <p className={`connection connection-${connection}`} role="status">
          <span className="connection-dot" aria-hidden="true" />
          {CONNECTION[connection]}
        </p>
      </div>

      {order.status !== 'cancelled' && (
        <ol className="tracking-steps">
          {STEPS.map((step, index) => (
            <li
              key={step}
              aria-current={index === currentStep ? 'step' : undefined}
              className={index < currentStep ? 'is-done' : index === currentStep ? 'is-current' : undefined}
            >
              {STATUS_LABELS[step]}
            </li>
          ))}
        </ol>
      )}

      <section className="tracking-layout" aria-labelledby="where-heading">
        {order.status !== 'cancelled' && (
          <DeliveryMap courier={tracking.courier} destination={tracking.destination} />
        )}

        {/* Beside the map (below it on a phone): everything the map shows, in words. It's in the
            server HTML, so it's there before the map loads, if the tiles fail, and for anyone
            using a screen reader. The live region announces each change of where the order is. */}
        <div className="tracking-text">
          <h2 id="where-heading">Where is my order?</h2>
          <p aria-live="polite">{tracking.summary}</p>
          <dl>
            <div>
              <dt>Delivering to</dt>
              <dd>{tracking.destination.name}</dd>
            </div>
            {tracking.arrivesAt && (
              <div>
                <dt>Expected</dt>
                <dd>
                  around <time dateTime={tracking.arrivesAt}>{when(tracking.arrivesAt, 'time')}</time> ({relative(tracking.arrivesAt, order.at)})
                </dd>
              </div>
            )}
            <div>
              <dt>Placed</dt>
              <dd>
                <time dateTime={order.placedAt}>{when(order.placedAt)}</time> ({relative(order.placedAt, order.at)})
              </dd>
            </div>
            <div>
              <dt>Last update</dt>
              <dd>
                <time dateTime={order.at}>{when(order.at, 'time')}</time>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
        {order.items.map((item) => (
          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>{etb(item.price * item.qty)}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: 'var(--accent-gold)' }}>
        <span>Total (incl. delivery &amp; VAT)</span>
        <span>{etb(order.total)}</span>
      </div>
    </div>
  );
}
