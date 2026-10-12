import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getDishById } from "../../../lib/dishes";

// A 1200×630 preview card for each dish, generated with ImageResponse from the dish record.
// It replaces the site-wide card on /menu/[id].
const size = { width: 1200, height: 630 };

// generateImageMetadata lets each dish's card have its own alt text.
export async function generateImageMetadata({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  return [{ id: "card", size, contentType: "image/png", alt: dish ? `${dish.name}, $${dish.price}, at Addis Eats` : "Addis Eats" }];
}

export default async function Image({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  if (!dish) return new ImageResponse(<div style={{ display: "flex" }}>Addis Eats</div>, size);

  const photo = await readFile(join(process.cwd(), "public", "images", "dishes", `${dish.id}.jpg`));

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f8fafc", color: "#0f172a" }}>
        <img src={`data:image/jpeg;base64,${photo.toString("base64")}`} width={520} height={630} style={{ objectFit: "cover" }} alt="" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px", gap: 20 }}>
          <div style={{ fontSize: 28, color: "#ea580c" }}>{`Addis Eats · ${dish.category}`}</div>
          <div style={{ fontSize: 76, lineHeight: 1.02 }}>{dish.name}</div>
          <div style={{ fontSize: 30, color: "#64748b", lineHeight: 1.35 }}>{dish.summary}</div>
          <div style={{ display: "flex", alignSelf: "flex-start", marginTop: 8, padding: "10px 24px", borderRadius: 14, background: "#ea580c", color: "#fff", fontSize: 44 }}>
            {`$${dish.price}`}
          </div>
        </div>
      </div>
    ),
    size
  );
}
