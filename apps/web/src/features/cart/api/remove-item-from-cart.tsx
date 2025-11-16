// src/features/cart/api/remove-item-from-cart.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/shared/lib/client";
import { useUserId } from "@/hooks/useUserId";
import { CART_QUERY_KEY } from "@/shared/utils/query-keys";
import { useCartStore } from "../../../../../../packages/store/src/use-cart-store";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const userId = useUserId();
  const { removeItem, setCart } = useCartStore();

  return useMutation({
    // 🔧 On accepte aussi selectedVariants
    mutationFn: async ({
      productId,
      selectedVariants,
    }: {
      productId: string;
      selectedVariants?: Record<string, string>;
    }) => {
      if (!userId) throw new Error("User ID manquant");

      // Envoie selectedVariants dans le corps de la requête
      const { data } = await client.delete(`/carts/${userId}/items/${productId}`, {
        data: { selectedVariants },
      });

      return data;
    },

    onSuccess: (data, { productId }) => {
      if (data?.items) {
        setCart(data.items);
      } else {
        removeItem(productId);
      }

      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY, userId] });
      console.log("🗑️ Article supprimé du panier");
    },

    onError: (error) => {
      console.error("❌ Erreur suppression du produit :", error);
    },
  });
};
