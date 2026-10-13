// Every price, number and time Addis Eats shows goes through this file: menu cards, cart,
// checkout, order pages, the kitchen board, the dashboard, page titles, link-preview cards and
// the CSV export. Each Intl formatter is built once, here at module level, and reused; building
// one per call is slow and is how two pages end up formatting the same value differently.
//
// Safe on the server and in the browser. Times are always Addis Ababa time, so the HTML from
// the server and the page after hydration print exactly the same text.
export const TIME_ZONE = 'Africa/Addis_Ababa';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 });
const moneyCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'ETB',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const digits = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

// etb(1235)                     → "ETB 1,235"
// etb(12300, { compact: true })  → "ETB 12.3K"  chart ticks and bar labels
// etb(1235, { unit: false })     → "1,235"      table cells under a "(ETB)" header, which paste
//                                               into a spreadsheet as numbers
export function etb(amount, { compact = false, unit = true } = {}) {
  const value = Number(amount) || 0;
  if (!unit) return digits.format(value);
  return (compact ? moneyCompact : money).format(value);
}

const inAddis = (options, locale = 'en-GB') => new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, ...options });

const DATES = {
  default: inAddis({ day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }), // 13 Oct, 14:05
  time: inAddis({ hour: '2-digit', minute: '2-digit' }), //                                   14:05
  day: inAddis({ day: 'numeric', month: 'short' }), //                                        13 Oct
  'day-year': inAddis({ day: 'numeric', month: 'short', year: 'numeric' }), //               13 Oct 2026
  'day-key': inAddis({ year: 'numeric', month: '2-digit', day: '2-digit' }, 'en-CA'), //     2026-10-13
  // Unambiguous, sorts as text, and a spreadsheet reads it as a date-time.
  sheet: inAddis({ year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }, 'sv-SE'), // 2026-10-13 14:05
};

// when(date) → "13 Oct, 14:05". when(date, 'time') → "14:05". The other styles are listed above.
export function when(date, style = 'default') {
  return DATES[style].format(new Date(date));
}

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

// relative(date, now) → "3 minutes ago", "in 5 minutes", "yesterday". `now` is passed in rather
// than read here, so the server render and the hydrated client measure from the same instant.
export function relative(date, now = Date.now()) {
  const seconds = Math.round((new Date(date) - new Date(now)) / 1000);
  const size = Math.abs(seconds);
  if (size < 45) return seconds > 0 ? 'in under a minute' : 'just now';
  if (size < 3_600) return rtf.format(Math.round(seconds / 60), 'minute');
  if (size < 86_400) return rtf.format(Math.round(seconds / 3_600), 'hour');
  return rtf.format(Math.round(seconds / 86_400), 'day');
}
