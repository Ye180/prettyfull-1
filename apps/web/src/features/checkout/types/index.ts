export interface CartItemType {
  id: string;
  name: string;
  description: string;
  size: string;
  price: number;
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