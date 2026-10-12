'use client';

import { useOrder } from '@/lib/queries';
import { STEPS, STATUS_LABELS } from './status';

// No useEffect, no useState: SWR owns the request, the data, the error and the polling.
export default function OrderTracker({ orderId, fallbackData }) {
  const { data: order, error, isValidating } = useOrder(orderId, fallbackData);
  const currentStep = STEPS.indexOf(order.status);
  const isFinal = order.status === 'delivered' || order.status === 'cancelled';

  return (
    <div className="card" style={{ padding: '2rem' }}>
      {order.status === 'cancelled' ? (
        <p style={{ color: 'var(--accent-red)', fontWeight: '700' }}>This order was cancelled.</p>
      ) : (
        <ol
          style={{
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            padding: 0,
          }}
        >
          {STEPS.map((step, index) => {
            const done = index <= currentStep;
            return (
              <li
                key={step}
                aria-current={index === currentStep ? 'step' : undefined}
                style={{
                  padding: '0.85rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-sm)',
                  border: done ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                  background: index === currentStep ? 'rgba(229, 169, 60, 0.15)' : 'transparent',
                  color: done ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: index === currentStep ? '700' : '500',
                  fontSize: '0.9rem',
                }}
              >
                {STATUS_LABELS[step]}
              </li>
            );
          })}
        </ol>
      )}

      <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
        {order.items.map((item) => (
          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>{item.price * item.qty} ETB</span>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: 'var(--accent-gold)' }}>
        <span>Total (incl. delivery & VAT)</span>
        <span>{order.total} ETB</span>
      </div>

      <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Delivering to {order.customer.address} · placed {new Date(order.placedAt).toLocaleTimeString()} ·{' '}
        {isFinal ? 'final status, no longer polling' : isValidating ? 'checking for updates…' : 'refreshes every 5s'}
      </p>
      {error && (
        <p role="alert" className="form-error">
          Couldn&apos;t refresh the status: {error.message}
        </p>
      )}
    </div>
  );
}
