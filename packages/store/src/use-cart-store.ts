import { create } from 'zustand';

// --- Définition des types ---

/**
 * Représentation minimale de l'objet Produit (TProduct)
 * tel que 'populé' par le service de panier du backend.
 */
export interface CartProduct {
  _id: string;
  name: { fr: string; en: string };
  price: { amount: number; currency: string };
  mainImageUrl?: string;
  slug?: string;
  // ... autres champs si nécessaires (ex: stock)
}

/**
 * C'est le type 'CartItem' qui correspond EXACTEMENT
 * au schéma du backend (backend/src/modules/carts/schemas/carts.schema.ts).
 */
export interface CartItem {
  product: CartProduct; // Le produit est un objet imbriqué
  quantity: number;
  price: number; // Le prix unitaire au moment de l'ajout
}

/**
 * L'état global du panier
 */
interface CartState {
  items: CartItem[];
  // Action pour hydrater le store (depuis l'API)
  setCart: (items: CartItem[]) => void;
  // Actions locales (appelées par les mutations React Query)
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  // Sélecteurs dérivés
  getItem: (productId: string) => CartItem | undefined;
  totalQuantity: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // Action pour remplacer le panier local par celui de l'API
  setCart: (items) =>
    set(() => {
      // Filtrer les items invalides et fusionner par product._id
      const map = new Map<string, CartItem>();
      for (const raw of items || []) {
        if (
          !raw ||
          !raw.product ||
          typeof raw.product._id !== 'string' ||
          !raw.product._id
        ) {
          continue;
        }
        const q = Math.max(0, Math.floor(Number(raw.quantity) || 0));
        if (q <= 0) continue;
        const unitPrice = Number(raw.price);
        if (!Number.isFinite(unitPrice) || unitPrice < 0) continue;

        const key = raw.product._id;
        const existing = map.get(key);
        if (existing) {
          // Conserver le prix unitaire historique du premier ajout
          map.set(key, { ...existing, quantity: existing.quantity + q });
        } else {
          map.set(key, {
            product: raw.product,
            quantity: q,
            price: unitPrice,
          });
        }
      }
      return { items: Array.from(map.values()) };
    }),

  // Ajoute ou met à jour un article
  addItem: (item) => {
    // Validation d'entrée (évite les états invalides)
    if (!item || !item.product || !item.product._id) return;
    const addQty = Math.max(0, Math.floor(Number(item.quantity) || 0));
    if (addQty <= 0) return;
    const unitPrice = Number(item.price);
    if (!Number.isFinite(unitPrice) || unitPrice < 0) return;

    set((state) => {
      const idx = state.items.findIndex(
        (i) => i.product._id === item.product._id,
      );
      if (idx > -1) {
        // Ne pas écraser le prix unitaire historique
        const updatedItems = [...state.items];
        const existingItem = updatedItems[idx];
        if (!existingItem) {
          return { items: state.items };
        }
        updatedItems[idx] = {
          ...existingItem,
          quantity: existingItem.quantity + addQty,
        };
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
        if (item.product._id === productId) {
          if (q > 0) {
            acc.push({ ...item, quantity: q });
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
      items: state.items.filter((item) => item.product._id !== productId),
    }));
  },

  // Vide le panier
  clearCart: () => set({ items: [] }),
  // Sélecteurs dérivés
  getItem: (productId) => get().items.find(i => i.product._id === productId),
  totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  totalAmount: () => get().items.reduce((sum, i) => sum + i.quantity * i.price, 0),
}));