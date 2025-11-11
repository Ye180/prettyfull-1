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

 addItem: (item) =>
  set((state) => {
    if (!item.productId) {
      console.warn("⚠️ Tentative d'ajout d'un item sans productId");
      return state;
    }

    const existingIndex = state.items.findIndex(
      (i) => i.productId === item.productId
    );

    const updatedItems = [...state.items];

    if (existingIndex === -1) {
      // item not in cart yet — add it
      updatedItems.push(item);
    } else {
      const existing = updatedItems[existingIndex]!;
      const updatedItem: CartItem = {
        productId: existing.productId,
        product: existing.product,
        quantity: (existing.quantity ?? 0) + (item.quantity ?? 0),
        sku: existing.sku ?? item.sku,
        unitPrice: existing.unitPrice ?? item.unitPrice,
        selectedVariants: existing.selectedVariants ?? item.selectedVariants,
      };
      updatedItems[existingIndex] = updatedItem;
    }

    return { items: updatedItems };
  }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),

  clearCart: () => set({ items: [], currentCartId: undefined }),
}));
