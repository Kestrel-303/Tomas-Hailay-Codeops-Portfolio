import { NavLink } from "react-router-dom";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
];

export default function Header() {
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
          </NavLink>
          <NavLink to="/cart" className="site-header__icon" aria-label="Cart">
            🛍
          </NavLink>
        </div>
      </div>
    </header>
  );
}
