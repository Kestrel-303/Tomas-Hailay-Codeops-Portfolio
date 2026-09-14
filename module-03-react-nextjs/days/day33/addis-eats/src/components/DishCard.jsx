import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

function DishCard({ id, name, price, category, isSpicy, onQuickView }) {
  const [crash, setCrash] = useState(false);

  // Each card subscribes only to its own quantity, so adding/removing one
  // dish no longer re-renders every other memoized card in the grid.
  const quantity = useCartStore((state) => state.items.find((item) => item.id === id)?.quantity ?? 0);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  if (crash) {
    throw new Error(`Simulated crash while rendering "${name}"`);
  }

  console.log(`[DishCard Rendered] - ${name}`);

  return (
    <article className="dish-card">
      <h3>{name}</h3>
      <p><small>Category: {category}</small></p>
      <p><strong>{String(price)} ETB</strong></p>
      {isSpicy && <p className="spicy-tag">🌶️ Spicy</p>}

      <div className="dish-actions">
        <button type="button" onClick={() => addToCart({ id, name, price, category, isSpicy })}>
          Add to cart
        </button>
        {quantity > 0 && (
          <button type="button" onClick={() => removeFromCart(id)}>-</button>
        )}
        <button type="button" onClick={() => onQuickView({ id, name, price, category, isSpicy })}>
          Quick view
        </button>
        <Link to={`/menu/${id}`} className="secondary-link">Details</Link>
      </div>

      <p className="cart-quantity">In cart: {quantity}</p>

      <button
        type="button"
        className="dev-crash-button"
        onClick={() => setCrash(true)}
        title="Deliberately throw during render to test the menu's error boundary"
      >
        💥 Simulate error
      </button>
    </article>
  );
}

DishCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  category: PropTypes.string,
  isSpicy: PropTypes.bool,
  onQuickView: PropTypes.func.isRequired,
};

export default memo(DishCard);
