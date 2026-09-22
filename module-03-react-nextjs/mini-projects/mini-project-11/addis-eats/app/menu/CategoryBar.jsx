'use client';

export default function CategoryBar({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="category-bar" role="tablist" aria-label="Menu categories">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={activeCategory === cat}
          className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat)}
          id={`category-btn-${cat.toLowerCase().replace(/[^a-z0-random]/g, '')}`}
        >
          {cat === 'All' && '🍽️ '}
          {cat === 'Signature' && '👑 '}
          {cat === 'Fasting / Veggie' && '🌱 '}
          {cat === 'Tibs' && '🔥 '}
          {cat}
        </button>
      ))}
    </div>
  );
}
