'use client';

import { useUpdateCartItem } from "../../api/update-items-in-cart";
import { PlusIcon } from "../../../../../../../packages/ui/src/icons/plus.icon";
import { MinusIcon } from "../../../../../../../packages/ui/src/icons/minus.icon";
import { useRef, useEffect, useCallback } from 'react';

interface Props {
  productId: string;
  initialQuantity: number;
}



export const QuantitySelector = ({ productId, initialQuantity }: Props) => {
	const updateMutation = useUpdateCartItem();

	// Utiliser un "debounce" pour éviter de surcharger l'API
	// L'API ne sera appelée que 500ms après que l'utilisateur ait fini de cliquer
	const debouncedUpdate = useDebouncedCallback((newQuantity: number) => {
		updateMutation.mutate({ productId, quantity: newQuantity });
	}, 500);

	const handleUpdate = (newQuantity: number) => {
		if (newQuantity < 0) return;
		
		// Mettre à jour (avec debounce)
		debouncedUpdate(newQuantity);
	};

	return (
		<div className="flex items-center gap-4">
			<button
				onClick={() => handleUpdate(initialQuantity - 1)}
				disabled={updateMutation.isPending}
				className="p-1 border rounded-md"
			>
				<MinusIcon className="w-5 h-5" />
			</button>
			<span className="w-8 text-center">
				{initialQuantity}
			</span>
			<button
				onClick={() => handleUpdate(initialQuantity + 1)}
				disabled={updateMutation.isPending}
				className="p-1 border rounded-md"
			>
				<PlusIcon className="w-5 h-5" />
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

	// keep latest callback
	useEffect(() => {
		savedCb.current = callback;
	}, [callback]);

	// clear on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, []);

	return useCallback((newQuantity: number) => {
		if (timeoutRef.current !== null) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = window.setTimeout(() => {
			savedCb.current(newQuantity);
			timeoutRef.current = null;
		}, delay);
	}, [delay]);
}

