import { ImageResponse } from "next/og";
import { dishes } from "../lib/dishes";

// The link preview for every page that doesn't make its own, at 1200×630. Next renders it at
// build time and writes the og:image / twitter:image tags with absolute URLs (metadataBase).
export const alt = "Addis Eats: Ethiopian home cooking, delivered, with doro wot, tibs, kitfo and shiro on the menu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  // Four real dishes from the menu data, so the card can't advertise a dish we don't sell.
  const featured = ["doro-wot", "tibs", "kitfo", "shiro"].map((id) => dishes.find((dish) => dish.id === id));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", background: "#f8fafc", color: "#0f172a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 700 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#ea580c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>A</div>
          Addis Eats
        </div>
        <div style={{ fontSize: 72, lineHeight: 1.05, marginTop: 36 }}>Ethiopian home cooking, delivered</div>
        <div style={{ display: "flex", gap: 16, marginTop: 44 }}>
          {featured.map((dish) => (
            <div key={dish.id} style={{ display: "flex", flexDirection: "column", padding: "16px 22px", borderRadius: 16, background: "#fff", border: "2px solid #e2e8f0", gap: 4 }}>
              <div style={{ fontSize: 28 }}>{dish.name}</div>
              <div style={{ fontSize: 24, color: "#ea580c" }}>{`$${dish.price}`}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
