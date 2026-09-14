import { useEffect, useMemo, useState, useCallback, Profiler } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import ErrorBoundary from '../components/ErrorBoundary';
import DishCard from '../components/DishCard';
import DishModal from '../components/DishModal';

function onRenderMenu(id, phase, actualDuration, baseDuration) {
  console.log(
    `[Profiler:${id}] phase=${phase} actualDuration=${actualDuration.toFixed(2)}ms baseDuration=${baseDuration.toFixed(2)}ms`,
  );
}

function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') ?? 'All';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickViewDish, setQuickViewDish] = useState(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const quickViewQuantity = useCartStore((state) =>
    quickViewDish ? state.items.find((item) => item.id === quickViewDish.id)?.quantity ?? 0 : 0,
  );

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await fetch('/menu.json');

        if (!response.ok) {
          throw new Error('Failed to load menu');
        }

        const data = await response.json();
        setItems(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      return matchesCategory;
    });
  }, [category, items]);

  const categories = ['All', 'Main-dish', 'Side-dish', 'Beverage'];

  const handleCategoryChange = (nextCategory) => {
    setSearchParams(nextCategory === 'All' ? {} : { category: nextCategory });
  };

  const handleQuickView = useCallback((dish) => {
    setQuickViewDish(dish);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setQuickViewDish(null);
  }, []);

  return (
    <section>
      <div className="category-bar">
        {categories.map((option) => (
          <button
            key={option}
            type="button"
            className={category === option ? 'category-button selected' : 'category-button'}
            onClick={() => handleCategoryChange(option)}
          >
            {option === 'All' ? 'All Items' : option}
          </button>
        ))}
      </div>

      {loading && <p>Loading menu...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <ErrorBoundary
          name="menu"
          fallback={(_error, reset) => (
            <div className="error-boundary-fallback" role="alert">
              <p>This dish couldn&apos;t be displayed.</p>
              <p><small>The rest of the app — header, cart, navigation — keeps working.</small></p>
              <button type="button" onClick={reset}>Reload menu section</button>
            </div>
          )}
        >
          <Profiler id="MenuDishList" onRender={onRenderMenu}>
            <div className="card-container">
              {filteredItems.map((item) => (
                <DishCard key={item.id} {...item} onQuickView={handleQuickView} />
              ))}
            </div>
          </Profiler>
        </ErrorBoundary>
      )}

      {quickViewDish && (
        <DishModal
          dish={quickViewDish}
          quantityInCart={quickViewQuantity}
          onClose={handleCloseQuickView}
          onAddToCart={addToCart}
        />
      )}
    </section>
  );
}

export default MenuPage;
