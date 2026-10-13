// Every number and time a person reads in Addis Eats goes through here, so a price, a chart
// tick and a CSV cell all agree. Times are always Addis Ababa time, whatever the server's or the
// browser's own time zone, so the server-rendered HTML and the hydrated page print the same text.
export const TIME_ZONE = "Africa/Addis_Ababa";

// Birr prices are whole numbers, so no cents are shown.
const birr = new Intl.NumberFormat("en-US", { style: "currency", currency: "ETB", maximumFractionDigits: 0 });
const birrCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "ETB",
  notation: "compact",
  maximumFractionDigits: 1,
});

// etb(1235) → "ETB 1,235"; etb(12300, { compact: true }) → "ETB 12.3K" (for chart ticks).
export function etb(amount, { compact = false } = {}) {
  return (compact ? birrCompact : birr).format(amount);
}

const dateAndTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const timeOnly = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" });
const dayOnly = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short" });
const dayAndYear = new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, day: "numeric", month: "short", year: "numeric" });
// en-CA prints "2026-10-13": the Addis Ababa calendar day, used to group orders by day.
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
// sv-SE prints "2026-10-13 14:05", which spreadsheets read as a date-time.
const sortable = new Intl.DateTimeFormat("sv-SE", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const STYLES = {
  default: dateAndTime, // "13 Oct, 14:05"
  time: timeOnly, //       "14:05"
  day: dayOnly, //         "13 Oct"
  "day-year": dayAndYear, // "13 Oct 2026"
  "day-key": dayKey, //    "2026-10-13"
  sortable, //             "2026-10-13 14:05"
};

// when(date) → "13 Oct, 14:05"; when(date, "time") → "14:05"; the other styles are listed above.
export function when(date, style = "default") {
  return STYLES[style].format(new Date(date));
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS = [
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

// relative(placedAt, now) → "3 minutes ago", "in 5 minutes", "just now". `now` is passed in rather
// than read here, so a server render and the hydrated client can agree on the same instant.
export function relative(date, now = Date.now()) {
  const seconds = Math.round((new Date(date).getTime() - new Date(now).getTime()) / 1000);
  if (Math.abs(seconds) < 45) return seconds > 0 ? "in under a minute" : "just now";
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size || unit === "minute") return rtf.format(Math.round(seconds / size), unit);
  }
}
