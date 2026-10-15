"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";

// Labelled pins drawn in CSS instead of Leaflet's default PNG markers (whose image paths break
// under a bundler). Each one says what it is, so the map doesn't rely on colour.
// keyboard: false: activating a marker does nothing, so it shouldn't be a Tab stop; the same
// details are written out below the map.
const pin = (text, className) =>
  L.divIcon({ className: `map-pin ${className}`, html: `<span>${text}</span>`, iconSize: null });

// Only ever loaded in the browser (next/dynamic with ssr: false, in OrderTracker).
export default function DeliveryMap({ courier, destination }) {
  const container = useRef(null);
  const map = useRef(null);
  const markers = useRef({});

  // Build the map once, and remove it on unmount so React's strict-mode double mount doesn't
  // leave a second map in the same div.
  useEffect(() => {
    const instance = L.map(container.current, { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(instance);
    markers.current.courier = L.marker([courier.lat, courier.lng], {
      icon: pin("🛵 Courier", "map-pin-courier"),
      title: "Courier",
      keyboard: false,
    }).addTo(instance);
    markers.current.destination = L.marker([destination.lat, destination.lng], {
      icon: pin("📍 You", "map-pin-destination"),
      title: "Delivery address",
      keyboard: false,
    }).addTo(instance);
    map.current = instance;
    return () => {
      instance.remove();
      map.current = null;
    };
    // Positions are applied by the effect below; this one only builds the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every update moves the markers and fits the view to both, so neither drifts off-screen.
  useEffect(() => {
    if (!map.current) return;
    markers.current.courier.setLatLng([courier.lat, courier.lng]);
    markers.current.destination.setLatLng([destination.lat, destination.lng]);
    map.current.fitBounds(L.latLngBounds([courier.lat, courier.lng], [destination.lat, destination.lng]), {
      // Padding keeps the labels inside the frame. maxZoom stops a street-level zoom once the
      // courier has arrived and both points are the same.
      padding: [48, 48],
      maxZoom: 15,
    });
  }, [courier.lat, courier.lng, destination.lat, destination.lng]);

  return (
    <div
      ref={container}
      className="map-frame"
      role="region"
      aria-label="Map of the courier and your delivery address. The same details are listed below the map."
    />
  );
}
