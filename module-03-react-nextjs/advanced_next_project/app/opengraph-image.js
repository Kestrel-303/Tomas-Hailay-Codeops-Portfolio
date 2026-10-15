import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

// The site-wide link preview (1200×630), used by every page that doesn't make its own.
// Next renders it once at build time and adds og:image / twitter:image tags with absolute URLs
// (via metadataBase in the root layout).
export const alt = 'Addis Eats: a fasting platter of stews and greens on injera, with the line "Ethiopian food, delivered in Addis Ababa"';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The home page's hero photo (Wikimedia Commons, CC BY-SA 2.0; the credit is printed on the card),
// read from a 1280px copy in public/images, like the dish cards do. It used to be fetched from
// upload.wikimedia.org at build time, which answered 429 Too Many Requests often enough that the
// card could silently lose its photo.
async function loadPhoto() {
  try {
    const file = await readFile(join(process.cwd(), 'public', 'images', 'hero-injera-1280.jpg'));
    return `data:image/jpeg;base64,${file.toString('base64')}`;
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
