"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MinusIcon } from "../../../../../../../packages/ui/src/icons/minus.icon";
import { PlusIcon } from "../../../../../../../packages/ui/src/icons/plus.icon";
import { useUpdateCartItem } from "../../api/backend/update-items-in-cart";

interface Props {
	productId: string;
	initialQuantity: number;
	selectedVariants?: Record<string, string>; // ✅ Ajouté
}

export const QuantitySelector = ({
	productId,
	initialQuantity,
	selectedVariants,
}: Props) => {
	const updateMutation = useUpdateCartItem();
	const [quantity, setQuantity] = useState(initialQuantity);

	// ✅ Débounce
	const debouncedUpdate = useDebouncedCallback((newQuantity: number) => {
		updateMutation.mutate({
			productId,
			quantity: newQuantity,
			selectedVariants,
		});
	}, 500);

	const handleUpdate = (newQuantity: number) => {
		if (newQuantity < 1) return;
		setQuantity(newQuantity);
		debouncedUpdate(newQuantity);
	};

	return (
		<div className="flex items-center px-4 py-2 space-x-4 bg-gray-100 rounded-full w-fit">
			<button
				onClick={() => handleUpdate(quantity - 1)}
				disabled={updateMutation.isPending}
				className={`w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer transition 
        ${updateMutation.isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
			>
				<MinusIcon className="w-8 h-8" />
			</button>

			<span className="w-10 text-lg font-medium text-center select-none">
				{quantity}
			</span>

			<button
				onClick={() => handleUpdate(quantity + 1)}
				disabled={updateMutation.isPending}
				className={`w-10 h-10 flex items-center justify-center rounded-full bg-black hover:bg-black/80 transition cursor-pointer
        ${updateMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
			>
				<PlusIcon className="w-8 h-9" color="white" />
			</button>
		</div>
	);
};

function useDebouncedCallback(
	callback: (newQuantity: number) => void,
	delay: number
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
		[delay]
	);
}
