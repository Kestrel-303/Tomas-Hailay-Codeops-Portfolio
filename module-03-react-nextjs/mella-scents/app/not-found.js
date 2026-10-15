import Link from 'next/link';

export const metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">404</p>
      <h1 className="page-section__title">Page Not Found</h1>
      <p className="page-section__body">The page or fragrance you&apos;re looking for doesn&apos;t exist.</p>
      <div className="receipt__actions">
        <Link href="/shop" className="btn btn-solid">
          Explore the Collection
        </Link>
        <Link href="/" className="btn">
          Return Home
        </Link>
      </div>
    </section>
  );
}
