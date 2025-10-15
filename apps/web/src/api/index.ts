// web/src/api/index.ts

// Centralisation des routes de l'API pour une maintenance facile
export const API_ROUTES = {
  // --- Authentification ---
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    getProfile: '/auth/profile',
  },

  // --- Utilisateurs (Users) ---
  users: {
    getAll: '/users',
    getById: (userId: string) => `/users/${userId}`,
    update: (userId: string) => `/users/${userId}`,
    remove: (userId: string) => `/users/${userId}`,
  },

  // --- Produits ---
  products: {
    getAll: '/products',
    getById: (productId: string) => `/products/${productId}`,
    create: '/products',
    update: (productId: string) => `/products/${productId}`,
    remove: (productId: string) => `/products/${productId}`,
  },

  // --- Catégories ---
  categories: {
    getAll: '/categories',
    getById: (categoryId: string) => `/categories/${categoryId}`,
    create: '/categories',
    update: (categoryId: string) => `/categories/${categoryId}`,
    remove: (categoryId: string) => `/categories/${categoryId}`,
  },

  // --- Panier (Cart) ---
  cart: {
    get: '/carts',
    addItem: '/carts/add',
    removeItem: (itemId: string) => `/carts/item/${itemId}`,
    clear: '/carts',
  },

  // --- Liste de souhaits (Wishlist) ---
  wishlist: {
    get: '/wishlists',
    add: '/wishlists',
    remove: (productId: string) => `/wishlists/${productId}`,
  },

  // --- Commandes (Orders) ---
  orders: {
    getAll: '/orders',
    getById: (orderId: string) => `/orders/${orderId}`,
    create: '/orders',
    update: (orderId: string) => `/orders/${orderId}`,
  },

  // --- Contenu du site (Site Content) ---
  siteContent: {
    getAll: '/site-content',
    getById: (contentId: string) => `/site-content/${contentId}`,
  },
};