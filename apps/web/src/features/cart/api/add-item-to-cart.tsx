// web/src/features/cart/api/add-item-to-cart.tsx

import { useMutation, useQueryClient } from '@tanstack/react-query';
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


// Hook de mutation React Query
export const useAddItemToCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // 3. Récupérer l'utilisateur (s'il existe)

  // --- NOUVELLE LOGIQUE POUR L'ID INVITÉ ---
  const getUserId = (): string => {
    // 1. Si l'utilisateur est connecté, utiliser son ID réel
    if (user?._id) {
      return user._id;
    }

    // 2. Sinon, chercher un ID invité dans le local storage
    let guestId = localStorage.getItem(GUEST_ID_STORAGE_KEY);

    // 3. Si pas d'ID invité, en créer un et le stocker
    if (!guestId) {
      guestId = crypto.randomUUID(); // Génère un ID unique
      localStorage.setItem(GUEST_ID_STORAGE_KEY, guestId);
    }

    return guestId;
  };
  // --- FIN DE LA NOUVELLE LOGIQUE ---

  return useMutation({
    mutationFn: (itemDto: AddItemDto) => {
      // 4. Obtenir l'ID (soit de l'utilisateur réel, soit de l'invité)
      const userIdToUse = getUserId();

      if (!userIdToUse) {
        return Promise.reject(new Error("Impossible d'obtenir un ID utilisateur ou invité"));
      }

      // 5. Appeler l'API avec cet ID
      return addItemToCart(itemDto, userIdToUse);
    },

    // En cas de succès
    onSuccess: () => {
      console.log('Article ajouté, invalidation du panier...');
      queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY] });
    },

    // En cas d'erreur
    onError: (error) => {
      console.error("Erreur lors de l'ajout au panier:", error);
    },
  });
};