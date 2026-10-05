"use client";

import { useCartStore } from "@prettyfull/store";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";

interface Props {
	productId: string;
	initialQuantity: number;
	className?: string;
}

/** Stepper −/+ sobre, branché directement sur le store panier. */
export const QuantitySelector = ({ productId, initialQuantity, className }: Props) => {
	const t = useTranslations("Cart.quantitySelector");
	const updateQuantity = useCartStore((state) => state.updateQuantity);

	const button =
		"flex justify-center items-center size-[3.2rem] text-[1.6rem] text-(--color-ink) transition-colors cursor-pointer hover:bg-(--color-surface-card) disabled:opacity-30 disabled:cursor-not-allowed";

	return (
		<div className={cn("inline-flex items-center border border-(--color-surface-border)", className)}>
			<button
				type="button"
				onClick={() => updateQuantity(productId, initialQuantity - 1)}
				disabled={initialQuantity <= 1}
				aria-label={t("decreaseAria")}
				className={button}
			>
				−
			</button>
			<span className="w-[3.2rem] text-[1.4rem] font-medium text-center select-none text-(--color-ink)">
				{initialQuantity}
			</span>
			<button
				type="button"
				onClick={() => updateQuantity(productId, initialQuantity + 1)}
				aria-label={t("increaseAria")}
				className={button}
			>
				+
			</button>
		</div>
	);
};
