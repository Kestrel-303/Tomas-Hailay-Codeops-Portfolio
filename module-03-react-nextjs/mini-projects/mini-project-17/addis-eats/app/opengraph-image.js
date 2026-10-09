import { ImageResponse } from 'next/og';

// The site-wide link preview (1200×630), used by every page that doesn't make its own.
// Next renders it once at build time and adds og:image / twitter:image tags with absolute URLs
// (via metadataBase in the root layout).
export const alt = 'Addis Eats: a fasting platter of stews and greens on injera, with the line "Ethiopian food, delivered in Addis Ababa"';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The home page's hero photo (Wikimedia Commons, CC BY-SA 2.0), at a 1280px width so the
// renderer doesn't have to decode the 6016px original. The credit is printed on the card.
const PHOTO =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Injera%2C_Fasting_Food%2C_Ethiopia_%2811286899826%29.jpg/1280px-Injera%2C_Fasting_Food%2C_Ethiopia_%2811286899826%29.jpg';

async function loadPhoto() {
  try {
    const res = await fetch(PHOTO, { headers: { 'User-Agent': 'AddisEats/1.0 (link preview)' } });
    if (!res.ok) return null;
    return `data:image/jpeg;base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
  } catch {
    return null; // still produce a card, just without the photo
  }
}

export default async function Image() {
  const photo = await loadPhoto();

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0b0d10', color: '#f5f1ea' }}>
        {photo && (
          <div style={{ width: 560, height: 630, display: 'flex', position: 'relative' }}>
            <img src={photo} width={560} height={630} style={{ objectFit: 'cover' }} alt="" />
            <div style={{ position: 'absolute', bottom: 14, left: 18, fontSize: 16, color: 'rgba(255,255,255,0.75)' }}>
              Photo: Rod Waddington, CC BY-SA 2.0
            </div>
          </div>
        )}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 64px', gap: 24 }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: '#e3a54b' }}>Addis Eats</div>
          <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.05 }}>Ethiopian food, delivered in Addis Ababa</div>
          <div style={{ fontSize: 28, color: '#b9b2a6', lineHeight: 1.35 }}>
            Doro wat, kitfo, tibs and fasting platters. Pay with Telebirr, CBE Birr or cash.
          </div>
        </div>
      </div>
    ),
    size
  );
}
