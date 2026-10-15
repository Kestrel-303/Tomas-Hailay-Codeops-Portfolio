import ProductCard from './ProductCard';

export default function ProductGrid({ products, eagerFirst = false }) {
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product.slug} product={product} priority={eagerFirst && index === 0} />
      ))}
    </div>
  );
}
