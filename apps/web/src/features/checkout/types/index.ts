export interface CartItemType {
  id: string;
  name: string;
  description: string;
  color: string;
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
