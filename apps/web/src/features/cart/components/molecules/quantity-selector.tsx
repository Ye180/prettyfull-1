"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MinusIcon } from "../../../../../../../packages/ui/src/icons/minus.icon";
import { PlusIcon } from "../../../../../../../packages/ui/src/icons/plus.icon";
import { useUpdateQuantityLineItem } from "../../api/medusa/update-quantity-line-item";

interface Props {
	productId: string;
	initialQuantity: number;
	selectedVariants?: Record<string, string>;
	cartId?: string;
}

export const QuantitySelector = ({
	productId,
	initialQuantity,
	cartId,
}: Props) => {
	const { applyOptimistic, persist } = useUpdateQuantityLineItem();
	const [quantity, setQuantity] = useState(initialQuantity);

	// Synchroniser si la quantité serveur change (ex: réconciliation, autre onglet)
	useEffect(() => {
		setQuantity(initialQuantity);
	}, [initialQuantity]);

	// ⚡ On débounce uniquement l'appel réseau : les clics rapides sont regroupés
	// en une seule requête, tandis que l'UI reste instantanée (voir handleUpdate).
	const debouncedPersist = useDebouncedCallback((newQuantity: number) => {
		if (!cartId) return;
		persist({ cartId, itemId: productId, quantity: newQuantity });
	}, 400);

	const handleUpdate = (newQuantity: number) => {
		if (newQuantity < 1 || !cartId) return;
		setQuantity(newQuantity); // ① nombre instantané
		applyOptimistic(cartId, productId, newQuantity); // ② total recalculé instantanément
		debouncedPersist(newQuantity); // ③ persistance serveur regroupée
	};

	return (
		<div className="flex items-center px-2 py-2 space-x-4 bg-gray-100 rounded-full w-fit">
			<button
				onClick={() => handleUpdate(quantity - 1)}
				disabled={quantity <= 1}
				className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 transition
					${quantity <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-200"}`}
			>
				<MinusIcon className="w-8 h-8" />
			</button>

			<span className="w-12 text-lg font-medium text-center text-[1.5rem] select-none">
				{quantity}
			</span>

			<button
				onClick={() => handleUpdate(quantity + 1)}
				className="flex justify-center items-center w-10 h-10 rounded-full transition cursor-pointer bg-black hover:bg-black/80"
			>
				<PlusIcon className="w-8 h-8" color="white" />
			</button>
		</div>
	);
};

function useDebouncedCallback(
	callback: (newQuantity: number) => void,
	delay: number,
): (newQuantity: number) => void {
	const timeoutRef = useRef<number | null>(null);
	const savedCb = useRef(callback);

	useEffect(() => {
		savedCb.current = callback;
	}, [callback]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, []);

	return useCallback(
		(newQuantity: number) => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = window.setTimeout(() => {
				savedCb.current(newQuantity);
				timeoutRef.current = null;
			}, delay);
		},
		[delay],
	);
}
