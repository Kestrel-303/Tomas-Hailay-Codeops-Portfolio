export const STEPS = ['placed', 'preparing', 'out-for-delivery', 'delivered'];

export const STATUS_LABELS = {
  placed: 'Placed 🧾',
  preparing: 'Preparing 🔥',
  'out-for-delivery': 'Out for delivery 🛵',
  delivered: 'Delivered ✅',
  cancelled: 'Cancelled',
};

export function statusBadgeClass(status) {
  if (status === 'cancelled') return 'badge-red';
  if (status === 'delivered') return 'badge-green';
  return 'badge-gold';
}
