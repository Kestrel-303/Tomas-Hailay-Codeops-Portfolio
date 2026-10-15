import Image from 'next/image';
import Link from 'next/link';
import { etb } from '@/lib/money';
import AddToBagButton from './AddToBagButton';
import QuickView from './QuickView';
import Rating from './Rating';
import WishlistButton from './WishlistButton';

// No hooks of its own, so it renders on the server where it can; the three buttons are client
// leaves. In the Vite version the wishlist and Quick View buttons sat inside the product link
// (a button inside a link is invalid HTML and confuses screen readers); here they're siblings.
export default function ProductCard({ product, priority = false }) {
  return (
    <article className="product-card">
      <div className="product-card__media">
        <Link href={`/product/${product.slug}`} className="product-card__image-wrap" tabIndex={-1} aria-hidden="true">
          <Image
            src={product.image}
            alt=""
            width={1000}
            height={1000}
            sizes="(max-width: 520px) 50vw, (max-width: 1240px) 33vw, 300px"
            {...(priority ? { loading: 'eager', fetchPriority: 'high' } : {})}
          />
        </Link>
        <WishlistButton product={product} />
        <QuickView product={product} />
      </div>
      <p className="product-card__brand">{product.brand}</p>
      <h3 className="product-card__title">
        <Link href={`/product/${product.slug}`}>{product.title}</Link>
      </h3>
      <Rating value={product.rating} />
      <div className="product-card__footer">
        <p className="product-card__price">{etb(product.price)}</p>
        <AddToBagButton product={product} className="product-card__add" />
      </div>
    </article>
  );
}
