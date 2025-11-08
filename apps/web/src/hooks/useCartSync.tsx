// web/src/hooks/useCartSync.ts

import { useEffect } from 'react';
import { useGetCart } from '@/features/cart/api/get-cart-by-userid';
// Le chemin d'import est correct, il remonte jusqu'au package 'store'
import { useCartStore } from '../../../../packages/store/src/use-cart-store';
import { useAuth } from './useAuth'; 

export const useCartSync = () => {
  const { isAuthenticated } = useAuth();
  const { data: apiCart, isLoading, isError, isSuccess } = useGetCart();
  const setCart = useCartStore((state) => state.setCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const localCartItems = useCartStore((state) => state.items);

  useEffect(() => {
    if (isAuthenticated && isSuccess) {
      // Cas 1: Utilisateur connecté ET la requête API a réussi
      if (apiCart) {
        // --- CORRECTION ---
        // Pas besoin de 'map'. L'API retourne déjà la bonne structure 
        // (confirmé par backend/src/modules/carts/carts.service.ts -> populate('items.product'))
        setCart(apiCart.items || []);
        // --- FIN CORRECTION ---
      } else {
        // L'API a répondu 'null' (ex: 404, pas de panier)
        setCart([]);
      }
    } else if (!isAuthenticated) {
      // Cas 2: Utilisateur non connecté -> Vider Zustand
      clearCart();
    }
    // 'clearCart' ajouté aux dépendances
  }, [apiCart, isAuthenticated, isSuccess, setCart, clearCart]); 

  return {
    cartItems: localCartItems,
    isLoading: isLoading,
    isError: isError,
  };
};