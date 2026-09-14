import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import DishCard from "../components/DishCard";

export default function Wishlist() {
  const { wishlistDetailed } = useShop();

  if (wishlistDetailed.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Your wishlist is empty.</p>
          <Link to="/" className="btn">Browse the Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Your Wishlist</h1>
      <div className="dish-grid">
        {wishlistDetailed.map(dish => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
}
