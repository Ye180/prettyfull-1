"use client";

import { useMemo } from "react";
import { useCartStore } from "../../../../packages/store/src/use-cart-store";

const TAX_RATE = 0.18;
const SHIPPING_FEE = 10;
const FREE_SHIPPING_THRESHOLD = 50000;

/**
 * Hook pour calculer et retourner le résumé du panier (subtotal, taxes, total)
 */
export const useCheckoutSummary = () => {
  const { items } = useCartStore();

  const summary = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + (item.unitPrice?.amount || 0) * item.quantity,
      0
    );

    const taxes = subtotal * TAX_RATE;
    const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + taxes + shipping;

    return {
      subtotal,
      taxes,
      shipping,
      total,
      currency: items[0]?.unitPrice?.currency || "USD",
    };
  }, [items]);

  return { items, summary };
};
