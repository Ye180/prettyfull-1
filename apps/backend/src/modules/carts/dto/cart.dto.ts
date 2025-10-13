/**
 * DTO pour ajouter un produit au panier
 */
export class AddToCartDto {
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

/**
 * DTO pour mettre à jour un item du panier
 */
export class UpdateCartItemDto {
  quantity: number;
  selectedVariants?: Record<string, string>;
}

/**
 * DTO pour un item du panier
 */
export class CartItemDto {
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

/**
 * DTO de réponse pour le panier
 */
export class CartResponseDto {
  userId: string;
  items: CartItemDto[];
  totalItems: number;
  updatedAt: Date;
}

/**
 * DTO pour la suppression d'un item du panier
 */
export class RemoveFromCartDto {
  selectedVariants?: Record<string, string>;
}
