import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { dishPhotoSrc } from '@/lib/dish-photos';
import { getDishById } from '@/lib/dishes';

// A 1200×630 link preview per dish, built from the dish record: what someone sees when a dish
// link is pasted into a group chat. It overrides the site-wide card for /menu/[id].
const size = { width: 1200, height: 630 };

// generateImageMetadata gives each dish's card its own alt text (an `alt` export can only be one
// string for every dish).
export async function generateImageMetadata({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  return [
    {
      id: 'card',
      size,
      contentType: 'image/png',
      alt: dish ? `${dish.name}, ${dish.priceFormatted}, at Addis Eats` : 'Addis Eats',
    },
  ];
}

export default async function Image({ params }) {
  const { id } = await params;
  const dish = getDishById(id);
  if (!dish) return new ImageResponse(<div style={{ display: 'flex' }}>Addis Eats</div>, size);

  const photo = await readFile(join(process.cwd(), 'public', dishPhotoSrc(dish)));
  const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`;
  // Emoji are left out: the renderer would fetch emoji images from a CDN for every card.
  const spice = dish.spiceLevel.replace(/[^\p{L}\p{N}\s-]/gu, '').trim();
  const blurb = dish.description.split('. ')[0].replace(/\.$/, '');

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0b0d10', color: '#f5f1ea' }}>
        <img src={photoSrc} width={500} height={630} style={{ objectFit: 'cover' }} alt="" />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px', gap: 18 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#e3a54b' }}>Addis Eats</div>
          <div style={{ fontSize: dish.name.length > 24 ? 54 : 64, fontWeight: 800, lineHeight: 1.05 }}>{dish.name}</div>
          <div style={{ display: 'flex', gap: 14, fontSize: 24 }}>
            <div style={{ display: 'flex', padding: '6px 16px', borderRadius: 999, background: 'rgba(227,165,75,0.18)', color: '#e3a54b' }}>{dish.category}</div>
            <div style={{ display: 'flex', padding: '6px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.08)' }}>{spice}</div>
            {/* Only when the category doesn't already say so ("Fasting / Veggie"). */}
            {dish.isFasting && !dish.category.includes('Fasting') && (
              <div style={{ display: 'flex', padding: '6px 16px', borderRadius: 999, background: 'rgba(80,180,120,0.2)', color: '#7fd3a0' }}>Fasting</div>
            )}
          </div>
          <div style={{ fontSize: 26, color: '#b9b2a6', lineHeight: 1.35 }}>{blurb.length > 120 ? `${blurb.slice(0, 117).replace(/\s+\S*$/, '')}…` : blurb}</div>
          <div style={{ fontSize: 46, fontWeight: 800, color: '#e3a54b' }}>{dish.priceFormatted}</div>
        </div>
      </div>
    ),
    size
  );
}
