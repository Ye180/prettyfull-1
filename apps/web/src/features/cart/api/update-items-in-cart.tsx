// web/src/features/cart/api/update-item-in-cart.tsx

import { useMutation, useQueryClient } from '@tanstack/react-query';
import client  from '@/shared/lib/client';
import { CART_QUERY_KEY } from '@/shared/utils/query-keys';

// DTO basé sur backend/src/modules/carts/dto/cart.dto.ts
interface UpdateItemDto {
  productId: string;
  quantity: number;
}

// Fonction d'appel API
const updateCartItem = async (itemDto: UpdateItemDto) => {
  // Appelle PATCH /carts/update-item (protégé par JwtAuthGuard)
  const { data } = await client.patch('/carts/update-item', itemDto);
  return data; // Retourne le panier mis à jour
};

// Hook de mutation React Query
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    
    // Si succès, invalider le cache du panier
    onSuccess: () => {
      // Force useGetCart à récupérer les nouvelles données
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
    },

    onError: (error) => {
      console.error("Erreur lors de la mise à jour de l'article:", error);
    },
  });
};