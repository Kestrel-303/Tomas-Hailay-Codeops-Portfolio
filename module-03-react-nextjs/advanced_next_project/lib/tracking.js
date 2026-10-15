import 'server-only';
import { FINAL_STATUSES, STAGES, toOwnerOrder } from './orders';

// Where the courier is. There's no courier app sending GPS yet, so the position follows the
// same timer that moves the order's status:
//   placed, preparing    at the kitchen
//   out-for-delivery     on a straight line from the kitchen to the customer's neighbourhood
//   delivered            at the neighbourhood
// Neighbourhoods are pinned to rough centre points, never to the customer's real address.
export const KITCHEN = { lat: 9.0107, lng: 38.7612, name: 'the Addis Eats kitchen at Meskel Square' };

const CENTRES = {
  Bole: { lat: 8.9967, lng: 38.7897 },
  Kazanchis: { lat: 9.0189, lng: 38.7671 },
  Piassa: { lat: 9.0337, lng: 38.7505 },
  Megenagna: { lat: 9.0203, lng: 38.8005 },
  Sarbet: { lat: 8.9958, lng: 38.734 },
  CMC: { lat: 9.0196, lng: 38.846 },
};

const rad = (deg) => (deg * Math.PI) / 180;

// Straight-line distance in km. Roads are longer, so the page always says "about".
function distanceKm(a, b) {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

const stageEnd = (status) => STAGES.find((stage) => stage.status === status).until;

export function trackingFor(order, now = Date.now()) {
  const { area, address } = order.customer;
  const destination = { ...(CENTRES[area] ?? CENTRES.Bole), name: `${address}, ${area}` };
  const placedAt = Date.parse(order.placedAt);
  const seconds = (now - placedAt) / 1000;

  const leaves = stageEnd('preparing');
  const arrives = stageEnd('out-for-delivery');
  let progress = 0;
  if (order.status === 'delivered') progress = 1;
  if (order.status === 'out-for-delivery') progress = Math.min(1, Math.max(0, (seconds - leaves) / (arrives - leaves)));

  const courier = {
    lat: KITCHEN.lat + (destination.lat - KITCHEN.lat) * progress,
    lng: KITCHEN.lng + (destination.lng - KITCHEN.lng) * progress,
  };
  const km = Math.round(distanceKm(courier, destination) * 10) / 10;

  // The sentence that tells someone who can't see the map where their order is.
  let summary;
  if (order.status === 'cancelled') summary = 'This order was cancelled, so no courier is coming.';
  else if (order.status === 'delivered') summary = `Your order has arrived in ${area}.`;
  else if (progress === 0) summary = `Your order is at ${KITCHEN.name}, about ${km} km from you. A courier picks it up once it's cooked.`;
  else summary = `Your courier is on the way to ${area}, about ${km} km from you (${Math.round(progress * 100)}% of the trip done).`;

  return {
    courier,
    destination,
    summary,
    km,
    progress,
    arrivesAt: FINAL_STATUSES.includes(order.status) ? null : new Date(placedAt + arrives * 1000).toISOString(),
  };
}

// One snapshot for the owner: the order, where it is, and the server's clock (`at`), so
// "3 minutes ago" is measured from the same instant in the server HTML and in the browser.
export function toTrackedOrder(order, now = Date.now()) {
  return { ...toOwnerOrder(order), tracking: trackingFor(order, now), at: new Date(now).toISOString() };
}
