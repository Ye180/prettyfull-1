"use client";

import { useAddItemToCartMedusa } from "@/features/cart/api/medusa/add-item-to-cart-medusa";
import { CartActionsProvider } from "@prettyfull/ui";
import { useMemo, type PropsWithChildren } from "react";

/**
 * Fournit l'implémentation des actions panier (Medusa) aux composants du
 * package UI via le contexte `CartActionsProvider`.
 *
 * Doit être monté à l'intérieur du QueryClientProvider (le hook utilise
 * react-query et le store de région).
 */
export const WebCartActionsProvider = ({ children }: PropsWithChildren) => {
	const mutation = useAddItemToCartMedusa();

	const value = useMemo(
		() => ({
			addToCart: (
				args: { cartId: string; quantity: number; variant_id: string },
				options?: { onSuccess?: () => void; onError?: (error: unknown) => void },
			) => mutation.mutate(args, options),
			isAddingToCart: mutation.isPending,
		}),
		[mutation.mutate, mutation.isPending],
	);

	return <CartActionsProvider value={value}>{children}</CartActionsProvider>;
};
