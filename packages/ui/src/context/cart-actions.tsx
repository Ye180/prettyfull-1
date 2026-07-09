"use client";

import { createContext, useContext } from "react";

export interface AddToCartArgs {
	cartId: string;
	quantity: number;
	variant_id: string;
}

export interface AddToCartOptions {
	onSuccess?: () => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onError?: (error: any) => void;
}

export interface CartActionsContextValue {
	addToCart: (args: AddToCartArgs, options?: AddToCartOptions) => void;
	isAddingToCart?: boolean;
}

const CartActionsContext = createContext<CartActionsContextValue | null>(null);

export const CartActionsProvider = CartActionsContext.Provider;

/**
 * Récupère les actions panier fournies par l'app hôte.
 * Fallback no-op si aucun provider n'est monté (ex: Storybook) afin d'éviter
 * un crash.
 */
export function useCartActions(): CartActionsContextValue {
	const ctx = useContext(CartActionsContext);
	if (!ctx) {
		return {
			addToCart: () => {
				if (typeof console !== "undefined") {
					console.warn(
						"[ui] useCartActions: aucun <CartActionsProvider> monté, addToCart ignoré.",
					);
				}
			},
			isAddingToCart: false,
		};
	}
	return ctx;
}
