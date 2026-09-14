import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

function DishModal({ dish, quantityInCart, onClose, onAddToCart }) {
  const closeButtonRef = useRef(null);
  const triggerElementRef = useRef(document.activeElement);

  useEffect(() => {
    const triggerElement = triggerElementRef.current;
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      triggerElement?.focus?.();
    };
  }, [onClose]);

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div className="dish-modal-overlay" onMouseDown={handleOverlayClick}>
      <div
        className="dish-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
      >
        <button
          type="button"
          ref={closeButtonRef}
          className="dish-modal-close"
          onClick={onClose}
          aria-label="Close quick view"
        >
          ×
        </button>

        <h3 id="dish-modal-title">{dish.name}</h3>
        <p><small>Category: {dish.category}</small></p>
        <p><strong>{String(dish.price)} ETB</strong></p>
        {dish.isSpicy && <p className="spicy-tag">🌶️ Spicy</p>}

        <div className="dish-modal-actions">
          <button type="button" onClick={() => onAddToCart(dish)}>Add to cart</button>
          <span>In cart: <strong>{quantityInCart}</strong></span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

DishModal.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    category: PropTypes.string,
    isSpicy: PropTypes.bool,
  }).isRequired,
  quantityInCart: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default DishModal;
