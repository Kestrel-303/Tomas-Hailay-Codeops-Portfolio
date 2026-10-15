import Link from 'next/link';

export const metadata = {
  title: 'About',
  description: 'Mella Scents is a minimal fragrance house in Addis Ababa, devoted to composed, wearable luxury.',
};

// Static: the same for every visitor, built once.
export default function AboutPage() {
  return (
    <section className="page-section container about">
      <p className="page-section__eyebrow">Our Story</p>
      <h1 className="page-section__title">About Mella Scents</h1>
      <p className="page-section__body">
        A minimalistic house dedicated to composed, wearable luxury fragrance. We choose a small collection from the great
        houses (Chanel, Dior, Gucci, Calvin Klein, Dolce &amp; Gabbana) and deliver it across Addis Ababa.
      </p>
      <p className="page-section__body">
        Every price is shown in birr and charged through TeleBirr exactly as shown, and delivery anywhere in the city is
        complimentary.
      </p>
      <Link href="/shop" className="btn btn-solid about__cta">
        Explore the Collection
      </Link>
    </section>
  );
}
