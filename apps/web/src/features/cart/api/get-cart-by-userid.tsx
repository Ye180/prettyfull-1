import { useQuery } from "@tanstack/react-query";
import client from "@/shared/lib/client";
import { CART_QUERY_KEY } from "@/shared/utils/query-keys";
import { CartItem } from "../../../../../../packages/store/src/use-cart-store";
import { useUserId } from "@/hooks/useUserId"; // Hook qui gère user ou invité

interface CartApiResponse {
  userId: string;
  items: CartItem[];
  totalItems: number;
  subtotal: { amount: number; currency: string };
  total: { amount: number; currency: string };
}

// --- Fonction de récupération du panier ---
const getCart = async (userId: string): Promise<CartApiResponse | null> => {
  try {
    // Détection automatique de la langue
    const lang =
      typeof window !== "undefined"
        ? navigator.language?.split("-")[0] || "fr"
        : "fr";

    // ✅ Requête GET correcte
    const { data } = await client.get<CartApiResponse>(`/carts/${userId}`, {
      headers: {
        "Accept-Language": lang, 
      },
    });

    return data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    console.error("Erreur de récupération du panier:", error);
    return null;
  }
};

// --- Hook principal pour React Query ---
export const useGetCart = () => {
  const userId = useUserId();

  return useQuery({
    queryKey: [CART_QUERY_KEY, userId],
    queryFn: () => getCart(userId as string),
    enabled: !!userId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
