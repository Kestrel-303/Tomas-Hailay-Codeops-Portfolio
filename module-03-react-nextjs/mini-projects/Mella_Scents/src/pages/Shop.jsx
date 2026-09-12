import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { endpoints } from "../lib/api";
import ProductGrid from "../components/product/ProductGrid";
import ProductFilters from "../components/product/ProductFilters";
import { LoadingMessage, ErrorMessage, EmptyMessage } from "../components/common/StatusMessage";

export default function Shop() {
  const { data, loading, error } = useFetch(endpoints.fragrances);
  const products = useMemo(() => data?.products ?? [], [data]);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";

  const maxPrice = useMemo(
    () => products.reduce((max, product) => Math.max(max, Math.ceil(product.price)), 0),
    [products]
  );
  const [priceLimit, setPriceLimit] = useState(null);
  const effectivePriceLimit = priceLimit ?? maxPrice;

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query);
      const matchesPrice = product.price <= effectivePriceLimit;

      return matchesQuery && matchesPrice;
    });
  }, [products, search, effectivePriceLimit]);

  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">The Collection</p>
      <h1 className="page-section__title">Shop All Fragrances</h1>

      {loading && <LoadingMessage />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && (
        <>
          <ProductFilters
            search={search}
            onSearchChange={(value) =>
              setSearchParams(value ? { q: value } : {}, { replace: true })
            }
            maxPrice={maxPrice}
            priceLimit={effectivePriceLimit}
            onPriceLimitChange={setPriceLimit}
          />

          {filtered.length === 0 ? (
            <EmptyMessage message="No fragrances match your search." />
          ) : (
            <ProductGrid products={filtered} />
          )}
        </>
      )}
    </section>
  );
}
