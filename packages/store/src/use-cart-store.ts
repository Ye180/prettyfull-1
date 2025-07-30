// packages/store/src/use-cart-store.ts
import { create } from "zustand";

type CartState = {
  items: string[];
  addItem: (item: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
}));
