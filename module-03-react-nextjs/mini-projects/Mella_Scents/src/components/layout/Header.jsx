import { NavLink } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore";
import { useWishlistStore } from "../../stores/useWishlistStore";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <header className="site-header">
      <div className="container site-header__row">
        <NavLink to="/" className="site-header__logo" aria-label="Mella Scents home">
          Mella&nbsp;Scents
        </NavLink>

        <nav className="site-header__nav" aria-label="Primary">
          <ul>
            {NAV_LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    isActive ? "site-header__link is-active" : "site-header__link"
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <NavLink to="/wishlist" className="site-header__icon" aria-label="Wishlist">
            ♡
            {wishlistCount > 0 && <span className="site-header__badge">{wishlistCount}</span>}
          </NavLink>
          <NavLink to="/cart" className="site-header__icon" aria-label="Cart">
            🛍
            {cartCount > 0 && <span className="site-header__badge">{cartCount}</span>}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
