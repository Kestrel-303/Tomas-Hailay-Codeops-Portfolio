// Post-deployment checks on a live URL, with no cookies: what a private window sees.
//
//   node scripts/check-live.mjs https://your-app.vercel.app
//   SESSION_SECRET=<production value> node scripts/check-live.mjs https://your-app.vercel.app
//
// With SESSION_SECRET set (it stays on your machine), every JavaScript file the pages load is also
// searched for its value. The signed-in checks are a short manual list in the README.
const base = (process.argv[2] ?? '').replace(/\/$/, '');
if (!/^https?:\/\//.test(base)) {
  console.error('Usage: node scripts/check-live.mjs https://your-app.vercel.app');
  process.exit(1);
}

let failed = 0;
const report = (ok, name, detail = '') => {
  if (!ok) failed++;
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? `  (${detail})` : ''}`);
};
async function check(name, path, init, test) {
  try {
    const res = await fetch(base + path, { redirect: 'manual', ...init });
    const body = res.status >= 300 && res.status < 400 ? '' : await res.text();
    const problem = test(res, body);
    report(!problem, name, problem || String(res.status));
  } catch (error) {
    report(false, name, error.message);
  }
}
const is = (code) => (res) => (res.status === code ? null : `got ${res.status}, expected ${code}`);
const toSignIn = (res) => (res.status >= 300 && res.status < 400 && (res.headers.get('location') ?? '').includes('/login') ? null : `got ${res.status}, expected a redirect to /login`);
const meta = (html, key) => html.match(new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]+content="([^"]*)"`))?.[1];

console.log(`Checking ${base}\n`);
report(base.startsWith('https://'), 'served over HTTPS');

// The shop, as a first-time visitor sees it.
await check('home page lists fragrances in ETB', '/', {}, (res, body) => (res.status === 200 && /ETB/.test(body) && /product-card/.test(body) ? null : `got ${res.status}`));
await check('shop lists the collection', '/shop', {}, (res, body) => (res.status === 200 && (body.match(/class="product-card"/g) || []).length >= 1 ? null : `got ${res.status}`));
await check('a fragrance page', '/product/8', {}, (res, body) => (res.status === 200 && /J'adore|J&#x27;adore/.test(body) ? null : `got ${res.status}`));
await check('a product photo is served from this site', '/products/8/1.webp', {}, (res) => (res.ok && (res.headers.get('content-type') ?? '').startsWith('image/') ? null : `got ${res.status}`));
await check('unknown fragrance → real 404', '/product/999', {}, is(404));
await check('unknown page → real 404', '/no-such-page', {}, is(404));
await check('about and sign-in pages', '/login', {}, is(200));
await check('bag (static shell)', '/cart', {}, is(200));

// Private pages and the API.
await check('/checkout → sign-in', '/checkout', {}, toSignIn);
await check('/account → sign-in', '/account', {}, toSignIn);
await check('/orders/… → sign-in', '/orders/MS-00000000', {}, toSignIn);
await check('nobody signed in', '/api/session', {}, (res, body) => (res.status === 200 && body.includes('"user":null') ? null : body.slice(0, 80)));
await check('GET /api/products', '/api/products', {}, (res, body) => (res.status === 200 && body.startsWith('[') ? null : `got ${res.status}`));
await check('unknown product → 404 JSON', '/api/products/999', {}, is(404));
await check('placing an order signed out → 401', '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }, is(401));
await check('reading an order signed out → 401', '/api/orders/MS-00000000', {}, is(401));

// Search engines and link previews.
await check('robots.txt', '/robots.txt', {}, (res, body) => (res.status === 200 && body.includes('Sitemap') ? null : `got ${res.status}`));
await check('sitemap.xml uses this address', '/sitemap.xml', {}, (res, body) => (res.status === 200 && body.includes(new URL(base).host) ? null : 'sitemap URLs point elsewhere: was this build made for this address?'));
for (const [label, path] of [['home', '/'], ['a fragrance page', '/product/8']]) {
  try {
    const html = await (await fetch(base + path)).text();
    const image = meta(html, 'og:image')?.replace(/&amp;/g, '&');
    report(meta(html, 'twitter:card') === 'summary_large_image' && Boolean(meta(html, 'og:title')), `link card tags on ${label}`, meta(html, 'og:title'));
    report(Boolean(image?.startsWith(base)), `og:image on ${label} is an absolute URL on this site`, image);
    if (image) {
      const res = await fetch(image);
      report(res.ok && (res.headers.get('content-type') ?? '').startsWith('image/'), `the card image for ${label} loads`, `${res.status} ${res.headers.get('content-type')}`);
    }
  } catch (error) {
    report(false, `link card on ${label}`, error.message);
  }
}

// No secret in the JavaScript a browser downloads.
try {
  const files = new Set();
  for (const path of ['/', '/shop', '/product/8', '/cart', '/login']) {
    const html = await (await fetch(base + path)).text();
    for (const m of html.matchAll(/<script[^>]+src="([^"]+\.js[^"]*)"/g)) files.add(m[1]);
  }
  const secret = process.env.SESSION_SECRET;
  const hits = [];
  let bytes = 0;
  for (const file of files) {
    const js = await (await fetch(new URL(file, base))).text();
    bytes += js.length;
    if (js.includes('SESSION_SECRET') || /scryptSync|createHmac/.test(js) || (secret && js.includes(secret))) hits.push(file);
  }
  report(hits.length === 0, `no secret in the ${files.size} JavaScript files the pages load`, hits.join(', ') || `${Math.round(bytes / 1024)} KB searched${secret ? ', including for the value' : ''}`);
} catch (error) {
  report(false, 'JavaScript secret scan', error.message);
}

console.log(failed ? `\n${failed} check(s) failed.` : '\nAll automatic checks passed. Now the signed-in list in the README, in a private window.');
process.exit(failed ? 1 : 0);
