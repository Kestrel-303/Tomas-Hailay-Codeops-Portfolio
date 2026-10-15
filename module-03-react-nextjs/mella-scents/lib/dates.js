// Order times, always in Addis Ababa time, so the server's time zone never shows through.
const full = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Addis_Ababa',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatOrderTime = (iso) => full.format(new Date(iso));
