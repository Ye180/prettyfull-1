import { useCartStore } from "@prettyfull/store";

export const useCart = () => {
	const { items, setCart, addItem, removeItem, clearCart } = useCartStore();

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
