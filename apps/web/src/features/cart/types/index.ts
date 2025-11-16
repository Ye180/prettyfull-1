

// web/src/features/cart/types/index.ts

import { CartItem } from "../../../../../../packages/store/src/use-cart-store";

// Importer le type de base de votre store

// Exporter le type pour l'utiliser dans vos composants
export type CartItemType = CartItem;

// Ce type est pour le résumé du panier
export interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
}