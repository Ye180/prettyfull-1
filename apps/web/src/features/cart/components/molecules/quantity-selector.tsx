"use client";

import { useCartStore } from "@prettyfull/store";
import { cn } from "@prettyfull/utils";
import { useEffect, useState } from "react";

interface Props {
	productId: string;
	initialQuantity: number;
	/** Squares off the pill/buttons - used by the cart drawer only. */
	square?: boolean;
}

export const QuantitySelector = ({
	productId,
	initialQuantity,
	square,
}: Props) => {
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
		<div
			className={cn(
				"flex items-center px-2 py-1 bg-[#F4F4F5] w-fit border border-gray-200",
				square ? "rounded-none" : "rounded-full",
			)}
		>
			<button
				type="button"
				onClick={() => handleUpdate(quantity - 1)}
				disabled={quantity <= 1}
				aria-label="Diminuer la quantité"
				className={cn(
					"w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-700 font-semibold transition",
					square ? "rounded-none" : "rounded-full",
					quantity <= 1
						? "opacity-40 cursor-not-allowed"
						: "hover:bg-gray-100 cursor-pointer shadow-xs",
				)}
			>
				<span className="text-sm leading-none select-none">−</span>
			</button>

			<span className="w-8 sm:w-10 font-semibold text-center select-none text-sm sm:text-base text-gray-900">
				{quantity}
			</span>

			<button
				type="button"
				onClick={() => handleUpdate(quantity + 1)}
				aria-label="Augmenter la quantité"
				className={cn(
					"w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-black text-white font-semibold hover:bg-black/80 transition cursor-pointer shadow-xs",
					square ? "rounded-none" : "rounded-full",
				)}
			>
				<span className="text-sm leading-none select-none">+</span>
			</button>
		</div>
	);
};
