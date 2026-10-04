'use client';

import { useOrder } from '@/lib/queries';
import { STATUS_LABELS, statusBadgeClass } from './status';

// Asks for the same key as OrderTracker. SWR shares one cache entry and dedupes the
// requests, so the page still makes one network call per poll, not two.
export default function OrderStatusBadge({ orderId, fallbackData }) {
  const { data: order } = useOrder(orderId, fallbackData);

  return <span className={`badge ${statusBadgeClass(order.status)}`}>{STATUS_LABELS[order.status] ?? order.status}</span>;
}
