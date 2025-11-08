// web/src/features/cart/api/use-get-cart.tsx
import { useQuery } from '@tanstack/react-query';
import client from '@/shared/lib/client';
import { CART_QUERY_KEY } from '@/shared/utils/query-keys';
import { useAuth } from '@/hooks/useAuth';
import { CartItem } from '../../../../../../packages/store/src/use-cart-store';

interface CartApiResponse {
  userId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: { amount: number; currency: string };
  total: { amount: number; currency: string };
}

const GUEST_ID_STORAGE_KEY = 'guest_user_id';

// Vérifie si un ID est un ObjectId Mongo valide
const isMongoId = (id?: string) => /^[0-9a-fA-F]{24}$/.test(id || '');

// Récupère un ID utilisateur ou un ID invité
const getUserId = (user?: any): string | null => {
  if (user?._id) return user._id;

  // récupère l'ID invité
  const guestId = localStorage.getItem(GUEST_ID_STORAGE_KEY);
  return guestId || null;
};

// Fonction de fetch
const getCart = async (userId: string): Promise<CartApiResponse | null> => {
  if (!isMongoId(userId)) {
    // Invité → pas d'appel API backend
    console.warn('🟡 Panier invité détecté : on reste sur le panier local');
    return null;
  }

  try {
    const { data } = await client.get<CartApiResponse>(`/carts/${userId}`);
    return data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error('Erreur de récupération du panier:', error);
    return null;
  }
};

// Hook principal
export const useGetCart = () => {
  const { user } = useAuth();
  const userId = typeof window !== 'undefined' ? getUserId(user) : null;

  return useQuery({
    queryKey: [CART_QUERY_KEY, userId],
    queryFn: () => getCart(userId as string),
    enabled: !!userId, // on n'appelle que si un ID existe
    retry: false,
    refetchOnWindowFocus: false,
  });
};
