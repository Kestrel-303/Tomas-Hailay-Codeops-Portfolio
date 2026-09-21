"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../../lib/cart-context";

export default function AddToCartButton({ dish }) {
  const router = useRouter();
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem(dish);
    router.push("/cart");
  }

  return (
    <button type="button" className="btn btn-primary btn-block" onClick={handleAddToCart}>
      Add {dish.name} to cart
    </button>
  );
}
