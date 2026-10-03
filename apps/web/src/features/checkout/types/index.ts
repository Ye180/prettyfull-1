import type { CurrencyCode } from "@prettyfull/contracts";

export interface CartItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Devise d'origine du prix (celle du produit) - défaut "xof" si absente. */
  currency?: CurrencyCode;
  image: string;
  quantity: number;
}

export interface CartSummaryType {
  subtotal: number;
  shipping: number;
  taxes?: number;
  total: number;
}



export interface CheckoutSummaryProps {
  totalAmount: string; // Le Subtotal calculé (ex: "150.00")
  cartItems: CartItemType[]; // Le tableau des articles pour l'aperçu visuel
}