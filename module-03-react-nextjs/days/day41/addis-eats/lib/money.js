// Every amount in Addis Eats is Ethiopian birr. One formatter, so prices, totals and chart axes
// all read the same way. Birr prices are whole numbers, so no cents are shown.
const full = new Intl.NumberFormat("en-US", { style: "currency", currency: "ETB", maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "ETB",
  notation: "compact",
  maximumFractionDigits: 1,
});

// "ETB 1,235"
export function formatETB(amount) {
  return full.format(amount);
}

// "ETB 12.3K", short enough for a chart axis tick.
export function formatETBCompact(amount) {
  return compact.format(amount);
}
