import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// --- Types
export interface CartProduct {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price?: { amount: number; currency: string };
  sku?: string;
}

/**
 * Coordonnées de l'article dans le catalogue.
 *
 * `productId` de `CartItem` identifie la *combinaison* choisie (coloris ×
 * taille) et sert de clé de ligne ; ce triplet-ci désigne le point de stock
 * correspondant côté API, seul moyen de commander la bonne déclinaison.
 * Optionnel pour rester compatible avec les paniers déjà persistés.
 */
export interface CartSelection {
  productId: string;
  variantId: string | null;
  sizeId: string | null;
}

export interface CartItem {
  productId: string;
  product: CartProduct;
  quantity: number;
  sku?: string;
  unitPrice?: { amount: number; currency: string };
  selectedVariants?: Record<string, string>;
  selection?: CartSelection;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  setCart: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

// Helper pour calculer le total des items
const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// --- Store
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
  items: [],
  totalItems: 0,

  setCart: (items) => set({ items, totalItems: calculateTotalItems(items) }),

  // Ajoute ou met à jour un article
  addItem: (item) => {
    // Validation d'entrée (évite les états invalides)
    if (!item || !item.productId || !item.product) return;
    const addQty = Math.max(0, Math.floor(Number(item.quantity) || 0));
    if (addQty <= 0) return;
    const unitPrice = Number(
      item.unitPrice?.amount ?? item.product.price?.amount ?? NaN
    );
    if (!Number.isFinite(unitPrice) || unitPrice < 0) return;

    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.productId === item.productId
      );
      if (existingItemIndex > -1) {
        // Ne pas écraser le prix unitaire historique
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        if (existingItem) {
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + addQty,
          };
        }
        return {
          items: updatedItems,
          totalItems: calculateTotalItems(updatedItems),
        };
      } else {
        // Ajouter le nouvel article
        const newItems = [...state.items, { ...item, quantity: addQty }];
        return { items: newItems, totalItems: calculateTotalItems(newItems) };
      }
    });
  },

  // Met à jour la quantité OU supprime l'article si quantité <= 0
  updateQuantity: (productId, quantity) => {
    set((state) => {
      const updatedItems = state.items.reduce((acc, item) => {
        if (item.productId === productId) {
          const newQuantity = Math.max(0, quantity);
          if (newQuantity > 0) {
            acc.push({ ...item, quantity: newQuantity });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);

      return {
        items: updatedItems,
        totalItems: calculateTotalItems(updatedItems),
      };
    });
  },

  // Supprime un article
  removeItem: (productId: string) => {
    set((state) => {
      const filteredItems = state.items.filter(
        (item) => item.productId !== productId
      );
      return {
        items: filteredItems,
        totalItems: calculateTotalItems(filteredItems),
      };
    });
  },

  // Vide le panier
  clearCart: () => set({ items: [], totalItems: 0 }),
    }),
    {
      name: "prettyfull-cart",
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
      partialize: (state: CartState) => ({
        items: state.items,
        totalItems: state.totalItems,
      }),
    }
  )
);
