// web/src/api/index.ts

// Centralisation des routes de l'API pour une maintenance facile
export const
  API_ROUTES = {
  // --- Authentification ---
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    getProfile: '/auth/profile/',
  },

  // --- Utilisateurs (Users) ---
  users: {
    getAll: '/users/',
    getById: (userId: string) => `/users/${userId}/`,
    update: (userId: string) => `/users/${userId}/`,
    remove: (userId: string) => `/users/${userId}/`,
  },

  // --- Produits ---
  products: {
    getAll: '/products/',
    getById: (productId: string) => `/products/${productId}/`,
    getBySlug: (productSlug: string) => `/products/slugname/${productSlug}/`,
    create: '/products',
    update: (productId: string) => `/products/${productId}/`,
    remove: (productId: string) => `/products/${productId}/`,
  },

  // --- Catégories ---
  categories: {
    getAll: '/categories/',
    getById: (categoryId: string) => `/categories/${categoryId}/`,
    getPrimaryCategories: '/categories/primary-category/',
    getSecondaireCategories: '/categories/secondary-category/',
    getChildrenCategories: (slug:string) => `/categories/slug/${slug}/children/`,
    getBySlug: (categorySlug: string) => `/categories/slug/${categorySlug}/`,
    getProductsByCategoryId: (categoryId: string) => `/categories/${categoryId}/products/`,
    create: '/categories',
    update: (categoryId: string) => `/categories/${categoryId}/`,
    remove: (categoryId: string) => `/categories/${categoryId}/`,
  },

  // --- Panier (Cart) ---
  cart: {
   
    getItem: (userId: string) => `/carts/${userId}/`,
    removeCartById: (userId: string) => `/carts/item/${userId}/`,

    addItemsToCartByUserId: (userId: string) => `/carts/${userId}/items/`,

    updateItemsProductByUserId: (userId: string, productId:string) => `/carts/${userId}/items/${productId}/`,
    removeItemsCartByUserId: (userId: string, productId:string) => `/carts/${userId}/items/${productId}/`,

  },

  // --- Liste de souhaits (Wishlist) ---
  wishlist: {
    get: '/wishlists',
    add: (productId: string) => `/wishlists/${productId}/`,
    remove: (productId: string) => `/wishlists/${productId}/`,
    removeAll : '/wishlists',
    check: (productId: string) => `/wishlists/check/${productId}/` // Ajout de la route check
  },

  // --- Commandes (Orders) ---
  orders: {
    getAll: '/orders',
    getById: (orderId: string) => `/orders/${orderId}/`,
    create: '/orders',
    cancel: (orderId: string) => `/orders/${orderId}/cancel/`,
    updatePaymentStatus: (orderId: string) => `/orders/${orderId}/payment-status/`,
    updateOrderStatus: (orderId: string) => `/orders/${orderId}/status/`,
    update: (orderId: string) => `/orders/${orderId}/`,
  },

  // --- Contenu du site (Site Content) ---
  siteContent: {
    getAll: '/site-content/',
    getById: (contentId: string) => `/site-content/${contentId}/`,
  },
};