import { useCartStore } from "@prettyfull/store";

export const useCart = () => {
	// Sélecteurs individuels : on ne se réabonne que sur le champ concerné.
	// Les actions zustand sont stables, les sélectionner une à une ne provoque
	// aucun rendu superflu (contrairement à la déstructuration du store entier).
	const items = useCartStore((state) => state.items);
	const setCart = useCartStore((state) => state.setCart);
	const addItem = useCartStore((state) => state.addItem);
	const removeItem = useCartStore((state) => state.removeItem);
	const clearCart = useCartStore((state) => state.clearCart);

	const total = items.reduce((acc, item) => {
		const candidate = item.unitPrice?.amount ?? (item.product as any)?.price;
		const price =
			typeof candidate === "number"
				? candidate
				: typeof candidate?.amount === "number"
					? candidate.amount
					: 0;

		return (
			acc + price * (typeof item.quantity === "number" ? item.quantity : 0)
		);
	}, 0);

	return {
		items,
		total,
		setCart,
		addItem,
		removeItem,
		clearCart,
	};
};
