import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartProduct } from "./use-cart-store";

// ponytail: mirrors use-cart-store.ts's shape/persist pattern exactly -
// no reason to invent a different convention for a sibling feature.

export interface WishlistItem {
  productId: string;
  product: CartProduct;
}

export interface WishlistState {
  items: WishlistItem[];
  isWishlisted: (productId: string) => boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      isWishlisted: (productId) =>
        get().items.some((i) => i.productId === productId),

      addItem: (item) => {
        if (!item || !item.productId || !item.product) return;
        set((state) => {
          if (state.items.some((i) => i.productId === item.productId)) {
            return state;
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      toggleItem: (item) => {
        if (get().items.some((i) => i.productId === item.productId)) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "prettyfull-wishlist",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state: WishlistState) => ({ items: state.items }),
    }
  )
);
