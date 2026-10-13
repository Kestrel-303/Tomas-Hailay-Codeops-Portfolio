import { FINAL_STATUSES, STAGES, toPublicOrder } from "./orders";

// There is no courier app yet, so the courier's position is worked out from the same timer that
// moves the order's status: at the kitchen until it's out for delivery, then along a straight
// line to the middle of the customer's neighbourhood, arriving as the order turns "delivered".
// Coordinates are approximate neighbourhood centres, not real addresses.
export const KITCHEN = { lat: 9.0107, lng: 38.7612, label: "Addis Eats kitchen, Meskel Square" };

const AREAS = {
  Bole: { lat: 8.9967, lng: 38.7897 },
  Kazanchis: { lat: 9.0189, lng: 38.7671 },
  Megenagna: { lat: 9.0203, lng: 38.8005 },
  Piassa: { lat: 9.0337, lng: 38.7505 },
  Sarbet: { lat: 8.9958, lng: 38.734 },
  CMC: { lat: 9.0196, lng: 38.846 },
};

// Straight-line distance in km (haversine). Roads are longer, so the text says "about".
function distanceKm(a, b) {
  const rad = (deg) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function stageWindow(status) {
  const index = STAGES.findIndex((stage) => stage.status === status);
  return { from: index > 0 ? STAGES[index - 1].until : 0, until: STAGES[index].until };
}

export function trackingFor(order, now = Date.now()) {
  const area = AREAS[order.customer.area] ?? AREAS.Bole;
  const destination = { ...area, label: `${order.customer.area} (your delivery address)` };
  const placedAt = new Date(order.placedAt).getTime();
  const seconds = (now - placedAt) / 1000;

  let progress = 0;
  if (order.status === "delivered") progress = 1;
  else if (order.status === "out-for-delivery") {
    const { from, until } = stageWindow("out-for-delivery");
    progress = Math.min(1, Math.max(0, (seconds - from) / (until - from)));
  }

  const courier = {
    lat: KITCHEN.lat + (destination.lat - KITCHEN.lat) * progress,
    lng: KITCHEN.lng + (destination.lng - KITCHEN.lng) * progress,
  };
  const deliveredBy = placedAt + stageWindow("out-for-delivery").until * 1000;

  return {
    courier,
    destination,
    kitchen: KITCHEN,
    // Where the courier is, in words, for the text that repeats the map.
    courierPlace:
      order.status === "cancelled"
        ? "No courier: the order was cancelled"
        : progress === 0
          ? "Waiting at the kitchen, Meskel Square"
          : progress === 1
            ? `Arrived in ${order.customer.area}`
            : `On the way to ${order.customer.area}`,
    kmToGo: Math.round(distanceKm(courier, destination) * 10) / 10,
    arrivesAt: FINAL_STATUSES.includes(order.status) ? null : new Date(deliveredBy).toISOString(),
  };
}

// One snapshot of an order for its owner: the order, where the courier is, and the server's
// clock (`at`), so the browser's "3 minutes ago" is measured from the same instant.
export function toTrackedOrder(order, now = Date.now()) {
  return { ...toPublicOrder(order), tracking: trackingFor(order, now), at: new Date(now).toISOString() };
}
