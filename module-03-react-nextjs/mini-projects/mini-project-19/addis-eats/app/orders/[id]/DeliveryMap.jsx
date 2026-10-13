'use client';

// Leaflet's own stylesheet: without it the tiles render as a scattered jumble and the zoom
// buttons and attribution lose their layout.
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

// Text labels instead of Leaflet's default pin images (whose PNG paths break once bundled).
// Each says what it is, so the two markers can be told apart without colour.
const marker = (text, kind) => L.divIcon({ className: `map-label map-label-${kind}`, html: text, iconSize: null });

// Browser-only: OrderTracker loads this through next/dynamic with ssr: false.
export default function DeliveryMap({ courier, destination }) {
  const container = useRef(null);
  const parts = useRef(null);

  // Build the map once; remove it on unmount, so strict mode's mount-unmount-mount doesn't
  // leave a second map inside the same div.
  useEffect(() => {
    const map = L.map(container.current, { scrollWheelZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      // OpenStreetMap's licence requires this credit; it stays visible in the corner.
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const courierMarker = L.marker([courier.lat, courier.lng], { icon: marker('🛵 Courier', 'courier'), title: 'Courier', keyboard: false }).addTo(map);
    const homeMarker = L.marker([destination.lat, destination.lng], { icon: marker('🏠 You', 'home'), title: 'Delivery address', keyboard: false }).addTo(map);
    parts.current = { map, courierMarker, homeMarker };
    return () => {
      map.remove();
      parts.current = null;
    };
    // Built once. The effect below keeps the markers and the view up to date.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Each update moves the markers and refits the view, so both always stay on screen.
  useEffect(() => {
    if (!parts.current) return;
    const { map, courierMarker, homeMarker } = parts.current;
    courierMarker.setLatLng([courier.lat, courier.lng]);
    homeMarker.setLatLng([destination.lat, destination.lng]);
    // Padding keeps the labels inside the frame; maxZoom stops a street-level zoom when the
    // courier has arrived and both points are the same.
    map.fitBounds([[courier.lat, courier.lng], [destination.lat, destination.lng]], { padding: [50, 50], maxZoom: 15 });
  }, [courier.lat, courier.lng, destination.lat, destination.lng]);

  return (
    <div
      ref={container}
      className="tracking-map"
      role="region"
      aria-label="Map of the courier and your delivery address. The same details are written out next to it."
    />
  );
}
