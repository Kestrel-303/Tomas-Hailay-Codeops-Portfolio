// Post-deployment checks against a live URL, with no cookies (what a private window sees).
//
//   node scripts/check-live.mjs https://your-app.vercel.app
//
// It covers what can be checked signed out. The signed-in checks (sign in, place an order, watch
// it to "delivered", export the CSV) are a short list in DEPLOY.md, done by hand in a private
// window.
const base = (process.argv[2] ?? '').replace(/\/$/, '');
if (!/^https?:\/\//.test(base)) {
  console.error('Usage: node scripts/check-live.mjs https://your-app.vercel.app');
  process.exit(1);
}

let failed = 0;
async function check(name, path, init, expect) {
  try {
    const res = await fetch(base + path, { redirect: 'manual', ...init });
    const body = res.status >= 300 && res.status < 400 ? '' : await res.text();
    const problem = expect(res, body);
    if (problem) failed++;
    console.log(`${problem ? '✗' : '✓'} ${name}: ${res.status}${problem ? `  ← ${problem}` : ''}`);
  } catch (error) {
    failed++;
    console.log(`✗ ${name}: ${error.message}`);
  }
}
const status = (want) => (res) => (res.status === want ? null : `expected ${want}`);
const redirectsTo = (prefix) => (res) =>
  res.status >= 300 && res.status < 400 && (res.headers.get('location') ?? '').includes(prefix) ? null : `expected a redirect to ${prefix}`;

console.log(`Checking ${base}\n`);

await check('HTTPS', '/', {}, () => (base.startsWith('https://') ? null : 'not https'));
await check('home page', '/home', {}, (res, body) => (res.status === 200 && body.includes('Addis Eats') ? null : 'expected 200 with the app'));
await check('menu', '/menu', {}, status(200));
await check('a prerendered dish page', '/menu/doro-wot', {}, (res, body) => (res.status === 200 && /Doro W/.test(body) ? null : 'expected the dish'));
await check('unknown dish is a real 404', '/menu/no-such-dish', {}, status(404));
await check('/orders sends a signed-out visitor to sign-in', '/orders', {}, redirectsTo('/sign-in'));
await check('/checkout sends a signed-out visitor to sign-in', '/checkout', {}, redirectsTo('/sign-in'));
await check('/kitchen sends a signed-out visitor to sign-in', '/kitchen', {}, redirectsTo('/sign-in'));
await check('session API says nobody is signed in', '/api/session', {}, (res, body) => (res.status === 200 && body.includes('"user":null') ? null : 'expected {"user":null}'));
await check('placing an order signed out is refused', '/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }, status(401));
await check('an order stream signed out is refused', '/api/orders/AE-0/stream', {}, status(401));
await check('the CSV export signed out is refused', '/kitchen/reports/orders.csv', {}, (res) => ([401, 307, 308].includes(res.status) ? null : 'expected 401 or a redirect'));
await check('sign-in page loads', '/sign-in', {}, status(200));

// Hashed build files should be cached for a year by the CDN.
const home = await (await fetch(base + '/home')).text();
const asset = home.match(/\/_next\/static\/[^"']+\.js/)?.[0];
if (asset) {
  await check('build assets are cached immutably', asset, {}, (res) => (/immutable/.test(res.headers.get('cache-control') ?? '') ? null : `cache-control: ${res.headers.get('cache-control')}`));
}

console.log(failed ? `\n${failed} check(s) failed.` : '\nAll signed-out checks passed. Now do the signed-in list in DEPLOY.md, in a private window.');
process.exit(failed ? 1 : 0);
