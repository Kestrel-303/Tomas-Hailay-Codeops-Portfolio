import { useMemo, useState } from "react";
import { useShop } from "../context/ShopContext";
import DishCard from "../components/DishCard";

const SORTS = {
  default: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Top Rated"
};

export default function Home() {
  const { dishes } = useShop();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const categories = useMemo(
    () => ["All", ...new Set(dishes.map(d => d.category))],
    [dishes]
  );

  const filtered = useMemo(() => {
    let list = dishes.filter(d => {
      const matchesSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || d.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [dishes, search, category, sort]);

  return (
    <div className="page">
      <section className="hero">
        <h1>Taste of Addis, delivered.</h1>
        <p>Authentic Ethiopian dishes made fresh — order from our full menu below.</p>
      </section>

      <section className="toolbar">
        <input
          type="search"
          placeholder="Search dishes or ingredients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search dishes"
          className="search-input"
        />

        <div className="toolbar__filters">
          <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category">
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort dishes">
            {Object.entries(SORTS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <p className="result-count">{filtered.length} dish{filtered.length !== 1 ? "es" : ""} found</p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No dishes match your search.</p>
        </div>
      ) : (
        <div className="dish-grid">
          {filtered.map(dish => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
