import { create } from 'zustand';

export const useOrderStore = create((set) => ({
  lastOrder: null,
  setLastOrder: (order) => set({ lastOrder: order }),
  clearLastOrder: () => set({ lastOrder: null }),
}));

export default useOrderStore;
