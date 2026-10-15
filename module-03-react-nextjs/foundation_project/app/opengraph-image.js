import { ImageResponse } from 'next/og';

// The site-wide link-preview card (1200×630), used by every page. Built once at build time.
// Text and colour only: no emoji (the renderer would fetch emoji images from a CDN) and no
// remote photo, so building the card can never fail on someone else's server.
export const alt = 'Addis Eats: authentic Ethiopian dishes made fresh in Bole, Addis Ababa';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px',
          background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 55%, #c0392b 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, opacity: 0.9 }}>Addis Eats</div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>Taste of Addis, delivered.</div>
        <div style={{ fontSize: 34, marginTop: 32, opacity: 0.92 }}>
          Doro wat, kitfo, shiro and buna from Bole. Pay with TeleBirr, CBE Birr or cash.
        </div>
      </div>
    ),
    size,
  );
}
