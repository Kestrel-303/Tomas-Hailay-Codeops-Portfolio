// The one set of checkout rules, carried over from the Vite version's validate.js and tightened.
// The checkout form runs validateCustomer() in the browser for instant feedback; the server
// action and POST /api/orders run validateOrder() again, which is the check that counts.
// No secrets here, so it's safe to ship to the browser.

export const DELIVERY_AREAS = ['Bole', 'Kazanchis', 'Megenagna', 'Piassa', 'Sarbet', 'CMC', 'Old Airport', '4 Kilo', 'Gotera', 'Ayat'];

// Ethio telecom (09…) and Safaricom (07…) mobiles, local or +251. Spaces and dashes are ignored.
const PHONE = /^(?:\+251|0)[97]\d{8}$/;

const text = (value) => (typeof value === 'string' ? value.trim() : '');

export function validateCustomer(input) {
  const body = input && typeof input === 'object' ? input : {};
  const values = {
    name: text(body.name),
    phone: text(body.phone).replace(/[\s-]/g, ''),
    area: text(body.area),
    notes: text(body.notes),
  };
  const fieldErrors = {};

  if (!values.name) fieldErrors.name = 'Full name is required.';
  else if (values.name.length > 80) fieldErrors.name = 'Keep the name under 80 characters.';

  if (!values.phone) fieldErrors.phone = 'Phone number is required.';
  else if (!PHONE.test(values.phone)) fieldErrors.phone = 'Enter a valid TeleBirr number (e.g. 09XXXXXXXX or +2519XXXXXXXX).';

  if (!DELIVERY_AREAS.includes(values.area)) fieldErrors.area = 'Choose a delivery area in Addis Ababa.';

  if (values.notes.length > 300) fieldErrors.notes = 'Keep delivery notes under 300 characters.';

  return { values, fieldErrors };
}

// The bag lines arrive as [{ id, qty }]. Prices are never taken from the request: the caller
// prices each line from the catalogue.
export function validateLines(lines, catalogue) {
  if (!Array.isArray(lines) || lines.length === 0) return { error: 'Your bag is empty.' };
  if (lines.length > 20) return { error: 'Too many items in one order.' };
  const items = [];
  for (const line of lines) {
    const product = catalogue.find((p) => p.slug === String(line?.id));
    const qty = Number(line?.qty);
    if (!product) return { error: `"${line?.id}" is not in the collection.` };
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) return { error: `Choose between 1 and 10 of ${product.title}.` };
    if (qty > product.stock) return { error: `Only ${product.stock} of ${product.title} left in stock.` };
    items.push({ id: product.slug, title: product.title, brand: product.brand, image: product.image, price: product.price, qty });
  }
  return { items };
}
