'use client';

import Image from 'next/image';
import { useState } from 'react';

// The three photos of a fragrance. Client only because choosing a thumbnail swaps the large photo.
// The thumbnails are buttons (aria-pressed says which is showing), so they work by keyboard.
export default function Gallery({ images, title }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="gallery">
      <div className="gallery__main">
        {/* The main photo is the page's largest paint, so it loads eagerly at high priority. */}
        <Image
          src={images[current]}
          alt={`${title}, photo ${current + 1} of ${images.length}`}
          width={1000}
          height={1000}
          sizes="(max-width: 720px) 100vw, 480px"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      {images.length > 1 && (
        <div className="gallery__thumbs" role="group" aria-label="Choose a photo">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className={`gallery__thumb${index === current ? ' is-current' : ''}`}
              aria-pressed={index === current}
              aria-label={`Show photo ${index + 1}`}
              onClick={() => setCurrent(index)}
            >
              <Image src={src} alt="" width={1000} height={1000} sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
