"use client";

import CartItem from "@/features/cart/cartItems";
import CartSummary from "@/features/cart/cartSummary";
import { CartItemType, CartSummaryType } from "@/features/cart/types";
import { FC, useState } from "react";


const Cart: FC = () => {
  const [items, setItems] = useState<CartItemType[]>([
    {
      id: "1",
      name: "Nike Form",
      description: "Dri-FIT Hooded Versatile Jacket",
      color: "Black",
      size: "L",
      price: 360,
      image: "data:image/jpeg;base64,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",
      quantity: 1,
    },
    {
      id: "2",
      name: "Nike Club",
      description: "Men's Short-Sleeve Polo",
      color: "White",
      size: "M",
      price: 38,
      image: "data:image/jpeg;base64,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",
      quantity: 1,
    },
  ]);

  const summary: CartSummaryType = {
    subtotal: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    shipping: 10,
    taxes: undefined,
    total:
      items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 10,
  };

  const handleIncrease = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between w-[90%] mx-auto py-12 gap-24">
      <div className="flex-1">
        <span className="text-2xl font-bold mb-6">Cart</span>
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <CartSummary summary={summary} />
    </div>
  );
};

export default Cart;
