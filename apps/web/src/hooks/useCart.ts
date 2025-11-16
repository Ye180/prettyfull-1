// // import { CartItem, useCartStore } from '@prettyfull/store/src/use-cart-store';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { useCallback, useEffect } from 'react';
// import { CartItem, useCartStore } from '../../../../packages/store/src/use-cart-store';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;
// const CART_ENDPOINT = `${API_URL}/carts`; // Ajuster si backend diffère (ex: /carts/me)
// const getLanguage = () =>
//   (typeof navigator !== 'undefined' && navigator.language?.split('-')[0]) || 'fr';

// interface ServerCartResponse {
//   items: CartItem[];
// }

// async function apiGetCart(): Promise<CartItem[]> {
//   const res = await fetch(`${CART_ENDPOINT}`, {
//     headers: { 'accept-language': getLanguage() },
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error('Failed to fetch cart');
//   const data: ServerCartResponse | CartItem[] = await res.json();
//   return Array.isArray(data) ? data : data.items;
// }

// async function apiAddItem(productId: string, quantity: number): Promise<CartItem> {
//   const res = await fetch(`${CART_ENDPOINT}/items`, {
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json',
//       'accept-language': getLanguage(),
//     },
//     credentials: 'include',
//     body: JSON.stringify({ productId, quantity }),
//   });
//   if (!res.ok) throw new Error('Failed to add item');
//   return await res.json();
// }

// async function apiUpdateItem(productId: string, quantity: number): Promise<CartItem | null> {
//   const res = await fetch(`${CART_ENDPOINT}/items/${productId}`, {
//     method: 'PATCH',
//     headers: {
//       'content-type': 'application/json',
//       'accept-language': getLanguage(),
//     },
//     credentials: 'include',
//     body: JSON.stringify({ quantity }),
//   });
//   if (res.status === 404) return null;
//   if (!res.ok) throw new Error('Failed to update item');
//   return await res.json();
// }

// async function apiRemoveItem(productId: string): Promise<void> {
//   const res = await fetch(`${CART_ENDPOINT}/items/${productId}`, {
//     method: 'DELETE',
//     headers: { 'accept-language': getLanguage() },
//     credentials: 'include',
//   });
//   if (!res.ok) throw new Error('Failed to remove item');
// }

// export function useHydrateCart() {
//   const setCart = useCartStore(s => s.setCart);
//   const query = useQuery({
//     queryKey: ['cart'],
//     queryFn: apiGetCart,
//     staleTime: 60_000,
//   });

//   useEffect(() => {
//     if (query.data) {
//       setCart(query.data);
//     }
//   }, [query.data, setCart]);

//   return query;
// }

// export function useAddToCart() {
//   const addItem = useCartStore(s => s.addItem);
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
//       apiAddItem(productId, quantity),
//     onMutate: async ({ productId, quantity }) => {
//       await queryClient.cancelQueries({ queryKey: ['cart'] });
//       const prev = useCartStore.getState().items;
//       // Optimisme: ajouter quantité sans prix écrasé (nécessite prix en dehors => fallback à 0 si inconnu)
//       addItem({
//         product: { _id: productId, name: { fr: '', en: '' }, price: { amount: 0, currency: 'EUR' } },
//         quantity,
//         price: 0,
//       });
//       return { prev };
//     },
//     onSuccess: (serverItem) => {
//       // Remplacer l'item optimiste par la version serveur (prix réel, nom, etc.)
//       const items = useCartStore.getState().items.map(i =>
//         i.product._id === serverItem.product._id ? serverItem : i,
//       );
//       useCartStore.setState({ items });
//     },
//     onError: (_err, _vars, ctx) => {
//       if (ctx?.prev) useCartStore.setState({ items: ctx.prev });
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['cart'] });
//     },
//   });
// }

// export function useUpdateCartItem() {
//   const updateQuantity = useCartStore(s => s.updateQuantity);
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
//       apiUpdateItem(productId, quantity),
//     onMutate: async ({ productId, quantity }) => {
//       await queryClient.cancelQueries({ queryKey: ['cart'] });
//       const prev = useCartStore.getState().items;
//       updateQuantity(productId, quantity);
//       return { prev };
//     },
//     onError: (_err, _vars, ctx) => {
//       if (ctx?.prev) useCartStore.setState({ items: ctx.prev });
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['cart'] });
//     },
//     onSuccess: (serverItem, vars) => {
//       if (!serverItem) {
//         // Item supprimé côté serveur (quantité devenue 0)
//         useCartStore.setState({
//           items: useCartStore.getState().items.filter(i => i.product._id !== vars.productId),
//         });
//       } else {
//         useCartStore.setState({
//           items: useCartStore.getState().items.map(i =>
//             i.product._id === serverItem.product._id ? serverItem : i,
//           ),
//         });
//       }
//     },
//   });
// }

// export function useRemoveCartItem() {
//   const removeItem = useCartStore(s => s.removeItem);
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (productId: string) => apiRemoveItem(productId),
//     onMutate: async (productId) => {
//       await queryClient.cancelQueries({ queryKey: ['cart'] });
//       const prev = useCartStore.getState().items;
//       removeItem(productId);
//       return { prev };
//     },
//     onError: (_err, _vars, ctx) => {
//       if (ctx?.prev) useCartStore.setState({ items: ctx.prev });
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['cart'] });
//     },
//   });
// }

// export function useClearCartServerAware() {
//   const clearCart = useCartStore(s => s.clearCart);
//   const queryClient = useQueryClient();
//   return useCallback(async () => {
//     try {
//       await fetch(`${CART_ENDPOINT}`, {
//         method: 'DELETE',
//         headers: { 'accept-language': getLanguage() },
//         credentials: 'include',
//       });
//     } finally {
//       clearCart();
//       queryClient.invalidateQueries({ queryKey: ['cart'] });
//     }
//   }, [clearCart, queryClient]);
// }

// // Sélecteurs dérivés pratiques
// export function useCartTotals() {
//   return {
//     quantity: useCartStore(s => s.totalQuantity()),
//     amount: useCartStore(s => s.totalAmount()),
//   };
// }
