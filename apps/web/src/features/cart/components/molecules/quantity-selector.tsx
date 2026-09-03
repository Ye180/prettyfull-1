"use client";

import { useCartStore } from "@prettyfull/store";
import { useEffect, useState } from "react";
import { MinusIcon } from "../../../../../../../packages/ui/src/icons/minus.icon";
import { PlusIcon } from "../../../../../../../packages/ui/src/icons/plus.icon";

interface Props {
	productId: string;
	initialQuantity: number;
}

export const QuantitySelector = ({ productId, initialQuantity }: Props) => {
	const updateQuantity = useCartStore((state) => state.updateQuantity);
	const [quantity, setQuantity] = useState(initialQuantity);

	useEffect(() => {
		setQuantity(initialQuantity);
	}, [initialQuantity]);

	const handleUpdate = (newQuantity: number) => {
		if (newQuantity < 1) return;
		setQuantity(newQuantity);
		updateQuantity(productId, newQuantity);
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
