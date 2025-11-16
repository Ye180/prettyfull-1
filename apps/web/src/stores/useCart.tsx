import { useCartStore } from "../../../../packages/store/src/use-cart-store";

export const useCart = () => {
  const { items, setCart, addItem, removeItem, clearCart } = useCartStore();

  const total = items.reduce(
    (acc, item) =>
      acc + (item.unitPrice?.amount ?? item.product.price ?? 0) * item.quantity,
    0
  );

  return {
    items,
    total,
    setCart,
    addItem,
    removeItem,
    clearCart,
  };
};
