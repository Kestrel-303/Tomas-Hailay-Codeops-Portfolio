import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import "./Cart.css";

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = useCartStore((state) => state.totalPrice());

  return (
    <section className="page-section container">
      <p className="page-section__eyebrow">Your Bag</p>
      <h1 className="page-section__title">Cart</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <p className="page-section__body">Your bag is empty.</p>
          <Link to="/shop" className="btn btn-solid">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart">
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <Link to={`/product/${item.id}`} className="cart-item__image-wrap">
                  <img src={item.thumbnail} alt={item.title} />
                </Link>

                <div className="cart-item__info">
                  <p className="cart-item__brand">{item.brand}</p>
                  <h3 className="cart-item__title">{item.title}</h3>
                  <p className="cart-item__price">${item.price.toFixed(2)}</p>
                </div>

                <div className="cart-item__quantity">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <span>Subtotal</span>
            <span className="cart-summary__total">${total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </section>
  );
}
