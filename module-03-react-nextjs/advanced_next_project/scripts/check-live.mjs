// Post-deployment checks on a live URL, with no cookies: what a private window sees.
//
//   node scripts/check-live.mjs https://your-app.vercel.app
//   SESSION_SECRET=<the production value> node scripts/check-live.mjs https://your-app.vercel.app
//
// With SESSION_SECRET set (it stays on your machine), it also downloads every JavaScript file
// the pages load and confirms the secret is in none of them. The signed-in checks are a short
// manual list in DEPLOY.md.
const base = (process.argv[2] ?? '').replace(/\/$/, '');
if (!/^https?:\/\//.test(base)) {
  console.error('Usage: node scripts/check-live.mjs https://your-app.vercel.app');
  process.exit(1);
}

let failed = 0;
function report(ok, name, detail = '') {
  if (!ok) failed++;
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? `  (${detail})` : ''}`);
}
async function get(path, init = {}) {
  const res = await fetch(path.startsWith('http') ? path : base + path, { redirect: 'manual', ...init });
  const body = res.status >= 300 && res.status < 400 ? '' : await res.text();
  return { res, body };
}
async function check(name, path, init, test) {
  try {
    const { res, body } = await get(path, init);
    const problem = test(res, body);
    report(!problem, name, problem || String(res.status));
  } catch (error) {
    report(false, name, error.message);
  }
}
const redirectsToSignIn = (res) =>
  res.status >= 300 && res.status < 400 && (res.headers.get('location') ?? '').includes('/sign-in') ? null : `got ${res.status}, expected a redirect to /sign-in`;
const meta = (html, key) => html.match(new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]+content="([^"]*)"`))?.[1];

console.log(`Checking ${base}\n`);

// --- The site works in a private window, with no session.
report(base.startsWith('https://'), 'served over HTTPS');
await check('home page', '/', {}, (res, body) => (res.status === 200 && body.includes('Addis') ? null : `got ${res.status}`));
await check('menu', '/menu', {}, (res) => (res.status === 200 ? null : `got ${res.status}`));
await check('a dish page', '/menu/doro-wat', {}, (res, body) => (res.status === 200 && body.includes('Doro Wat') ? null : `got ${res.status}`));
await check('unknown dish → 404', '/menu/no-such-dish', {}, (res) => (res.status === 404 ? null : `got ${res.status}`));
await check('unknown page → 404', '/no-such-page', {}, (res) => (res.status === 404 ? null : `got ${res.status}`));
await check('/orders → sign-in', '/orders', {}, redirectsToSignIn);
await check('/checkout → sign-in', '/checkout', {}, redirectsToSignIn);
await check('/kitchen → sign-in', '/kitchen', {}, redirectsToSignIn);
await check('no session', '/api/session', {}, (res, body) => (res.status === 200 && body.includes('"user":null') ? null : body.slice(0, 60)));
await check('order API refuses a stranger', '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }, (res) => (res.status === 401 ? null : `got ${res.status}`));
await check('tracking stream refuses a stranger', '/api/orders/AE-0/stream', {}, (res) => (res.status === 401 ? null : `got ${res.status}`));
await check('order history CSV refuses a stranger', '/orders/export.csv', {}, (res) => ([401, 307, 308].includes(res.status) ? null : `got ${res.status}`));
await check('robots.txt', '/robots.txt', {}, (res, body) => (res.status === 200 && body.includes('Sitemap') ? null : `got ${res.status}`));
await check('sitemap.xml uses the live address', '/sitemap.xml', {}, (res, body) => (res.status === 200 && body.includes(new URL(base).host) ? null : 'sitemap URLs point somewhere else: is SITE_URL right?'));

// --- A shared link renders as a card: the tags exist, point at this site, and the image loads.
try {
  const { body } = await get('/menu/doro-wat');
  const image = meta(body, 'og:image');
  report(Boolean(meta(body, 'og:title')), 'og:title on a dish page', meta(body, 'og:title'));
  report(meta(body, 'twitter:card') === 'summary_large_image', 'twitter:card is summary_large_image', meta(body, 'twitter:card'));
  report(Boolean(image && image.startsWith(base)), 'og:image is an absolute URL on this site', image);
  if (image) {
    const res = await fetch(image.replace(/&amp;/g, '&'));
    report(res.ok && (res.headers.get('content-type') ?? '').startsWith('image/'), 'the card image loads', `${res.status} ${res.headers.get('content-type')}`);
  }
} catch (error) {
  report(false, 'link preview card', error.message);
}

// --- No secret in the JavaScript the browser downloads.
try {
  const scripts = new Set();
  for (const path of ['/', '/menu', '/menu/doro-wat', '/sign-in']) {
    const { body } = await get(path);
    for (const src of body.matchAll(/<script[^>]+src="([^"]+\.js[^"]*)"/g)) scripts.add(src[1]);
  }
  let total = 0;
  const hits = [];
  const secret = process.env.SESSION_SECRET;
  for (const src of scripts) {
    const js = await (await fetch(new URL(src, base))).text();
    total += js.length;
    if (js.includes('SESSION_SECRET')) hits.push(`${src} contains the name SESSION_SECRET`);
    if (secret && js.includes(secret)) hits.push(`${src} contains the secret's value`);
  }
  report(hits.length === 0, `no secret in the ${scripts.size} JavaScript files the pages load`, hits.join('; ') || `${Math.round(total / 1024)} KB searched${secret ? ', value and name' : ', name only (set SESSION_SECRET to search for the value too)'}`);
} catch (error) {
  report(false, 'JavaScript secret scan', error.message);
}

console.log(failed ? `\n${failed} check(s) failed.` : '\nAll signed-out checks passed. Now the signed-in list in DEPLOY.md, in a private window.');
process.exit(failed ? 1 : 0);
