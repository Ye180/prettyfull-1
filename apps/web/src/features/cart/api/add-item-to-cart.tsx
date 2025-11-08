// web/src/features/cart/api/add-item-to-cart.tsx

import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import client from '@/shared/lib/client';
import { CART_QUERY_KEY } from '@/shared/utils/query-keys';
import { useAuth } from '@/hooks/useAuth'; // 1. Importer useAuth

// DTO basé sur backend/src/modules/carts/dto/cart.dto.ts
interface AddItemDto {
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string>; // 2. Assurez-vous que les variantes sont ici
}

// Clé pour le localStorage
const GUEST_ID_STORAGE_KEY = 'guest_user_id';

const addItemToCart = async (itemDto: AddItemDto, userId: string) => {
  const { data } = await client.post(`/carts/${userId}/items`, {
    productId: itemDto.productId,
    quantity: Number(itemDto.quantity), // <-- forcer number
    selectedVariants: itemDto.selectedVariants,
  });
  return data;
};


export const useAddItemToCart = (): UseMutationResult<
  any,        // type de retour de l’API
  Error,      // type d’erreur
  AddItemDto  // variables
> => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const getUserId = (): string => {
    if (user?._id) return user._id;
    let guestId = localStorage.getItem('guest_user_id');
    if (!guestId) {
      guestId = crypto.randomUUID();
      localStorage.setItem('guest_user_id', guestId);
    }
    return guestId;
  };

  return useMutation({
    mutationFn: async (itemDto: AddItemDto) => {
      const userId = getUserId();
      const { data } = await client.post(`/carts/${userId}/items`, itemDto);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};
