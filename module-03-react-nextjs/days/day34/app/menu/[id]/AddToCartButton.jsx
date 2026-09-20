"use client";

import { useRouter } from "next/navigation";

export default function AddToCartButton({ dishName }) {
  const router = useRouter();

  function handleAddToCart() {
    router.push("/cart");
  }

  return (
    <button type="button" onClick={handleAddToCart}>
      Add {dishName} to cart
    </button>
  );
}
