import "./ProductFilters.css";

export default function ProductFilters({
  search,
  onSearchChange,
  maxPrice,
  priceLimit,
  onPriceLimitChange,
}) {
  return (
    <div className="product-filters">
      <label className="product-filters__search">
        <span className="visually-hidden">Search by product or brand</span>
        <input
          type="search"
          placeholder="Search by fragrance or brand…"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <label className="product-filters__range">
        <span>
          Price up to <strong>${priceLimit.toFixed(0)}</strong>
        </span>
        <input
          type="range"
          min="0"
          max={maxPrice}
          value={priceLimit}
          onChange={(event) => onPriceLimitChange(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
