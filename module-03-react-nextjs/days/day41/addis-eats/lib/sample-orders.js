import { dishes } from "./dishes";

// Fourteen days of plausible finished orders, so the reports page has something to chart before
// real orders build up. Seeded, so the same history comes back every time.
const NAMES = ["Abebe", "Sara", "Hana", "Dawit", "Meron", "Yonas", "Liya", "Samuel", "Tigist", "Kebede", "Selam", "Biruk"];
const AREAS = ["Bole", "Kazanchis", "Piassa", "Megenagna", "Sarbet", "CMC"];

function seeded(seed) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
}

export function buildSampleOrders(days = 14, now = new Date()) {
  const random = seeded(2026);
  const pick = (list) => list[Math.floor(random() * list.length)];
  const orders = [];

  // Addis Ababa is UTC+3 all year. Shifting by 3 hours makes the UTC date fields below read as
  // Addis Ababa calendar days, the same days the report groups by.
  const addisNow = new Date(now.getTime() + 3 * 3_600_000);

  for (let daysAgo = days - 1; daysAgo >= 0; daysAgo--) {
    // Busier at the weekend: 4–9 orders on weekdays, 8–14 on Saturday and Sunday.
    const day = new Date(addisNow.getTime() - daysAgo * 86_400_000);
    const weekend = day.getUTCDay() === 0 || day.getUTCDay() === 6;
    const count = (weekend ? 8 : 4) + Math.floor(random() * (weekend ? 7 : 6));

    for (let n = 0; n < count; n++) {
      // Between 11:00 and 21:00 Addis Ababa time, never in the future.
      const localHour = 11 + Math.floor(random() * 10);
      const placedAt = new Date(
        Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), localHour - 3, Math.floor(random() * 60))
      );
      if (placedAt > now) continue;

      const items = Array.from({ length: 1 + Math.floor(random() * 3) }, () => {
        const dish = pick(dishes);
        return { id: dish.id, name: dish.name, price: dish.price, quantity: 1 + Math.floor(random() * 2) };
      });

      orders.push({
        id: `AE-S${placedAt.getTime().toString(36).toUpperCase()}${n}`,
        ownerId: "sample",
        customer: { name: pick(NAMES), phone: "0911000000", area: pick(AREAS), notes: "" },
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: random() < 0.08 ? "cancelled" : "delivered",
        placedAt: placedAt.toISOString(),
      });
    }
  }
  return orders;
}
