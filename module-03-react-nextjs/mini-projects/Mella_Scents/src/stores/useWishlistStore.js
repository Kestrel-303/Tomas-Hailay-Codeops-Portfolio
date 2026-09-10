import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      isInWishlist: (id) => get().items.some((item) => item.id === id),

      toggleItem: (product) => {
        const { id, title, brand, price, thumbnail } = product;

        if (get().isInWishlist(id)) {
          set({ items: get().items.filter((item) => item.id !== id) });
          return;
        }

        set({ items: [...get().items, { id, title, brand, price, thumbnail }] });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
    }),
    { name: "mella-wishlist" }
  )
);
