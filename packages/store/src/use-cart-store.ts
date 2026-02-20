import { create } from "zustand";

// --- Types
export interface CartProduct {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price?: { amount: number; currency: string };
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
  totalItems: number;
  setCart: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  syncCart: () => Promise<void>;
}

// Helper pour calculer le total des items
const calculateTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// --- Store
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  currentCartId:
    typeof window !== "undefined"
      ? localStorage.getItem("guest_cart_id") || undefined
      : undefined,
  totalItems: 0,

  setCart: (items) => set({ items, totalItems: calculateTotalItems(items) }),

  // Ajoute ou met à jour un article
  addItem: (item) => {
    // Validation d'entrée (évite les états invalides)
    if (!item || !item.product || !item.product.id) return;
    const addQty = Math.max(0, Math.floor(Number(item.quantity) || 0));
    if (addQty <= 0) return;
    const unitPrice = Number(
      item.unitPrice?.amount ?? item.product.price?.amount ?? NaN
    );
    if (!Number.isFinite(unitPrice) || unitPrice < 0) return;

    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.product.id === item.product.id
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
        if (item.product.id === productId) {
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
        (item) => item.product.id !== productId
      );
      return {
        items: filteredItems,
        totalItems: calculateTotalItems(filteredItems),
      };
    });
  },

  // Vide le panier
  clearCart: () => set({ items: [], totalItems: 0 }),

  // Synchronise le panier avec le backend
  syncCart: async () => {
    try {
      const currentUserId = get().currentCartId;
      if (!currentUserId) {
        console.warn("No cart ID found, skipping sync");
        return;
      }

      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:7777";
      const lang =
        typeof window !== "undefined"
          ? navigator.language?.split("-")[0] || "fr"
          : "fr";

      const response = await fetch(`${backendUrl}/carts/${currentUserId}`, {
        method: "GET",
        headers: {
          "Accept-Language": lang,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.items) {
        set({
          items: data.items,
          totalItems: data.totalItems || calculateTotalItems(data.items),
        });
        console.log("✅ Cart synced from backend:", data.totalItems, "items");
      }
    } catch (error) {
      console.error("❌ Error syncing cart:", error);
    }
  },
}));
