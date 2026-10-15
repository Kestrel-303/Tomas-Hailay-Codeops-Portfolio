// Every price Mella Scents shows or charges is in Ethiopian birr. The catalogue comes from
// DummyJSON in US dollars, so it's converted once, on the server, at one fixed rate. (The Vite
// version showed "$89.99" on the product and then charged "ETB 90" at checkout.)
//
// A fixed demo rate, not a live exchange rate: prices stay stable between page loads, and the
// checkout charges exactly what the shop showed.
export const USD_TO_ETB = 150;

// $89.99 → 13,500 ETB: converted, then rounded to the nearest 10 birr, as shop prices are.
export function usdToEtb(usd) {
  return Math.round((Number(usd) * USD_TO_ETB) / 10) * 10;
}

const birr = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

// "ETB 13,500". The non-breaking space keeps "ETB" and the amount on one line.
export function etb(amount) {
  return `ETB ${birr.format(Number(amount) || 0)}`;
}
