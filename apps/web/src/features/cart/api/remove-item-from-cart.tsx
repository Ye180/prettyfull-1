// web/src/features/cart/api/remove-item-from-cart.tsx

import { useMutation, useQueryClient } from '@tanstack/react-query';
import client from '@/shared/lib/client';
import { CART_QUERY_KEY } from '@/shared/utils/query-keys';

// Fonction d'appel API
const removeCartItem = async (productId: string) => {
  // Appelle DELETE /carts/remove-item/:productId (protégé par JwtAuthGuard)
  const { data } = await client.delete(`/carts/remove-item/${productId}`);
  return data; // Retourne le panier mis à jour
};

// Hook de mutation React Query
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    
    onSuccess: () => {
      // Force useGetCart à récupérer les nouvelles données
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
    },

    onError: (error) => {
      console.error("Erreur lors de la suppression de l'article:", error);
    },
  });
};