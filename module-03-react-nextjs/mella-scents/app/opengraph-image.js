import { ImageResponse } from 'next/og';

// The site-wide link-preview card (1200×630), built once at build time. Product pages use the
// product's own photo instead. Text and colour only, in Mella's cream and gold: no emoji (the
// renderer would fetch them from a CDN) and no remote image, so the build can't fail on them.
export const alt = 'Mella Scents: luxury perfumes in Addis Ababa';
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
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 35%, #fff6ea 0%, #faebd7 70%)',
          color: '#2b2420',
          border: '18px solid #c5a059',
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 10, textTransform: 'uppercase', color: '#a9843f' }}>Est. Fragrance House · Addis Ababa</div>
        <div style={{ fontSize: 120, marginTop: 24, letterSpacing: 4 }}>Mella Scents</div>
        <div style={{ fontSize: 34, marginTop: 24, color: '#6b5f54' }}>Minimal bottles. Maximal presence.</div>
      </div>
    ),
    size,
  );
}
