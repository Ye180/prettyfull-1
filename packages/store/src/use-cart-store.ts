import { create } from 'zustand';

// --- Définition des types ---

/**
 * Représentation minimale de l'objet Produit (TProduct)
 * tel que 'populé' par le service de panier du backend.
 */
interface CartProduct {
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
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // Action pour remplacer le panier local par celui de l'API
  setCart: (items) => set({ items }),

  // Ajoute ou met à jour un article
  addItem: (item) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.product._id === item.product._id, // Comparaison par l'ID du produit
      );
      if (existingItemIndex > -1) {
        // Mettre à jour la quantité
        const updatedItems = [...state.items];
        const updatedItem = { ...updatedItems[existingItemIndex] };
        updatedItem.quantity += item.quantity;
        updatedItems[existingItemIndex] = updatedItem;
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
        if (item.product._id === productId) {
          const newQuantity = Math.max(0, quantity);
          if (newQuantity > 0) {
            acc.push({ ...item, quantity: newQuantity });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]), // Typer l'accumulateur pour corriger l'erreur TS
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
}));