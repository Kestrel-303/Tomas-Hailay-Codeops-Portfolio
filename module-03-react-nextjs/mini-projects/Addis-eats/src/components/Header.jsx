import { NavLink } from "react-router-dom";
import { useShop } from "../context/ShopContext";

export default function Header() {
  const { cartCount, wishlist } = useShop();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="brand">
          <span className="brand__mark">🍽️</span>
          <span>Addis Eats</span>
        </NavLink>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Menu
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "active" : "")}>
            Wishlist
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
            Cart
            {cartCount > 0 && <span className="badge badge--accent">{cartCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
