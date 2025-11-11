import { create } from "zustand";

// --- Types
export interface CartProduct {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  sku?: string;
}

export interface CartItem {
  productId: string;
  product: CartProduct;
  quantity: number;
  sku?: string;
  unitPrice?: { amount: number; currency: string };
  selectedVariants?: Record<string, string>;
}

export interface CartState {
  items: CartItem[];
  currentCartId?: string;
  setCart: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}
// --- Store
export const useCartStore = create<CartState>((set) => ({
  items: [],
  currentCartId:
    typeof window !== "undefined"
      ? localStorage.getItem("guest_cart_id") || undefined
      : undefined,

  setCart: (items) => set({ items }),

  // Ajoute ou met à jour un article
  addItem: (item) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.product.id === item.product.id
      );
      if (existingItemIndex > -1) {
        // Mettre à jour la quantité
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        if (existingItem) {
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + item.quantity,
          };
        }
        return { items: updatedItems };
      } else {
        // Ajouter le nouvel article
        return { items: [...state.items, item] };
      }
    });
  },

  // Met à jour la quantité OU supprime l'article si quantité <= 0
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.reduce((acc, item) => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(0, quantity);
          if (newQuantity > 0) {
            acc.push({ ...item, quantity: newQuantity });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]),
    }));
  },

  // Supprime un article
  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  // Vide le panier
  clearCart: () => set({ items: [] }),
}));
