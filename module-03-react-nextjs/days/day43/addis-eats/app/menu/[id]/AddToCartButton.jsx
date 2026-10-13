"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../../lib/cart-context";

export default function AddToCartButton({ dish }) {
  const router = useRouter();
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem(dish);
    // Loaded by the third-party script in the root layout; skip it if that hasn't arrived.
    window.confetti?.({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
    router.push("/cart");
  }

  return (
    <button type="button" className="btn btn-primary btn-block" onClick={handleAddToCart}>
      Add {dish.name} to cart
    </button>
  );
}
