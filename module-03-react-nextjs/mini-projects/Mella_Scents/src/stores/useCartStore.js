import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const { id, title, brand, price, thumbnail } = product;
        const existing = get().items.find((item) => item.id === id);

        if (existing) {
          set({
            items: get().items.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
          return;
        }

        set({
          items: [...get().items, { id, title, brand, price, thumbnail, quantity: 1 }],
        });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      setQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: "mella-cart" }
  )
);
