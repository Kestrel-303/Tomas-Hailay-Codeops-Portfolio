// The bag, as the server sees it. The browser keeps the bag in an `ms_bag` cookie holding only
// product ids and quantities, never prices or names: checkout reads it on the server and prices
// every line from the catalogue, so editing the cookie can't make anything cheaper.
// Shared by the browser (writing) and the server (reading).
export const CART_COOKIE = 'ms_bag';
export const MAX_QTY = 10;
export const MAX_LINES = 20;

// "6:2,8:1" ⇄ [{ id: '6', qty: 2 }, { id: '8', qty: 1 }]. Anything malformed is dropped.
export function serializeCart(lines) {
  return lines
    .filter((line) => line.qty > 0)
    .slice(0, MAX_LINES)
    .map((line) => `${line.id}:${line.qty}`)
    .join(',');
}

export function parseCart(value) {
  if (!value || typeof value !== 'string') return [];
  const seen = new Set();
  const lines = [];
  for (const part of decodeURIComponent(value).split(',')) {
    const match = /^(\d{1,6}):(\d{1,2})$/.exec(part.trim());
    if (!match || seen.has(match[1])) continue;
    const qty = Math.min(MAX_QTY, Number(match[2]));
    if (qty < 1) continue;
    seen.add(match[1]);
    lines.push({ id: match[1], qty });
    if (lines.length === MAX_LINES) break;
  }
  return lines;
}
