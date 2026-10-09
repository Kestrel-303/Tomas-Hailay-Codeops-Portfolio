// Shared by every dish photo. Safe to import from client components (no data, no secrets).

// Every file in public/images/dishes is 1200×900. next/image needs the real size to reserve the
// box before the file arrives and to pick which resized copy to serve.
export const DISH_PHOTO = { width: 1200, height: 900 };

export function dishPhotoSrc(dish) {
  return `/images/dishes/${dish.id}.jpg`;
}

// Alt text says what is on the plate, not just the dish name a sighted user already sees in
// the heading next to it. (The files in public/images/dishes are generated stand-ins; this
// text describes the dish photo each one stands in for. See PERF.md.)
export function dishPhotoAlt(dish) {
  const firstSentence = dish.description.split('.')[0];
  return `A plate of ${dish.name}: ${firstSentence.charAt(0).toLowerCase()}${firstSentence.slice(1)}`;
}

// The cards fill a `minmax(320px, 1fr)` grid inside a 1200px page, with 1.5rem card padding:
// one column below ~870px, two up to the page max, then about 360px each.
export const DISH_CARD_SIZES = '(max-width: 868px) calc(100vw - 6rem), (max-width: 1200px) calc(50vw - 4.5rem), 360px';
