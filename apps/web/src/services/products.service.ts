// web/src/services/products.service.ts
import apiClient from '@/api/client';
import { API_ROUTES } from '@/api';
import { ProductTypes } from '@/features/products/types';

export const productService = {
  /**
   * Récupère la liste de tous les produits.
   * @returns Une promesse qui résout avec un tableau de produits.
   */

  getAllProducts: async (): Promise<ProductTypes[]> => {
    const response = await apiClient.get<ProductTypes[]>(API_ROUTES.products.getAll);
    return response.data;
  },

  /**
   * Récupère un produit spécifique par son identifiant.
   * @param id - L'ID du produit à récupérer.
   * @returns Une promesse qui résout avec l'objet du produit.
   */

  getProductById: async (id: string): Promise<ProductTypes> => {
    const response = await apiClient.get<ProductTypes>(API_ROUTES.products.getById(id));
    return response.data;
  },

  /**
   * Crée un nouveau produit.
   * @param productData - Les données du produit à créer (doit correspondre à votre DTO backend).
   * @returns Une promesse qui résout avec le nouveau produit créé.
   */

  createProduct: async (productData: Omit<ProductTypes, 'id'>): Promise<ProductTypes> => {
    const response = await apiClient.post<ProductTypes>(API_ROUTES.products.getAll, productData);
    return response.data;
  },
  
  // Implémentez les fonctions pour updateProduct et deleteProduct de la même manière.
};