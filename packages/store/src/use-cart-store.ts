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
  // Sélecteurs dérivés
  getItem: (productId: string) => CartItem | undefined;
  totalQuantity: () => number;
  totalAmount: () => number;
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
    // Validation d'entrée (évite les états invalides)
    if (!item || !item.product || !item.product._id) return;
    const addQty = Math.max(0, Math.floor(Number(item.quantity) || 0));
    if (addQty <= 0) return;
    const unitPrice = Number(item.price);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) return;

    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.product.id === item.product.id
      );
      if (idx > -1) {
        // Ne pas écraser le prix unitaire historique
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        if (existingItem) {
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + item.quantity,
          };
        }
        return { items: updatedItems };
      }
      // Ajouter le nouvel article avec son prix unitaire courant
      return {
        items: [
          ...state.items,
          { product: item.product, quantity: addQty, price: unitPrice },
        ],
      };
    });
  },

  // Met à jour la quantité OU supprime l'article si quantité <= 0
  updateQuantity: (productId, quantity) => {
    const q = Math.max(0, Math.floor(Number(quantity) || 0));
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
  // Sélecteurs dérivés
  getItem: (productId) => get().items.find(i => i.product._id === productId),
  totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalAmount: () => get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
}));
