// web/src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/products.service';
import { ProductTypes } from '@/features/products/types';

// La clé de base pour toutes les requêtes liées aux produits.
// Permet d'invalider tout le cache des produits en une seule fois.
const PRODUCTS_QUERY_KEY = 'products';

/**
 * Hook pour récupérer la liste de tous les produits.
 */
export const useGetProducts = () => {
  return useQuery({
    // queryKey est un tableau qui identifie cette requête de manière unique.
    // ['products'] est la clé pour la liste complète.
    queryKey: [PRODUCTS_QUERY_KEY],
    // queryFn est la fonction qui sera appelée pour fetcher les données.
    queryFn: productService.getAllProducts,
  });
};

/**
 * Hook pour récupérer un seul produit par son ID.
 * @param productId - L'ID du produit.
 */
export const useGetProductById = (productId: string) => {
  return useQuery({
    // La clé inclut l'ID pour que chaque produit ait son propre cache.
    // Ex: ['products', '123-abc']
    queryKey: [PRODUCTS_QUERY_KEY, productId],
    queryFn: () => productService.getProductById(productId),
    // La requête ne s'exécutera que si `productId` a une valeur.
    // Évite les appels inutiles avec un ID vide.
    enabled: !!productId,
  });
};

/**
 * Hook pour créer un nouveau produit (Mutation).
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn est la fonction à appeler pour effectuer la modification (POST, PUT, DELETE).
    mutationFn: (newProductData: Omit<ProductTypes, 'id'>) => 
      productService.createProduct(newProductData),
    
    // onSuccess est appelé après une mutation réussie.
    onSuccess: () => {
      // Invalide le cache pour la clé 'products'.
      // React Query va automatiquement re-fetcher les données mises à jour
      // pour tous les composants qui utilisent `useGetProducts`.
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
    // Vous pouvez aussi gérer onError, onSettled, etc.
  });
};