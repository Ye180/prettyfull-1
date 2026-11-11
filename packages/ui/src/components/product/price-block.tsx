import { formatCurrency_FR } from "@prettyfull/utils";

export interface PriceBlockProps {
	price: number;
	compareAtPrice?: number;
	currencySymbol: string;
	/** Formate un montant dans la devise choisie (conversion incluse). Prioritaire sur `currencySymbol`. */
	formatPrice?: (amount: number) => string;
	className?: string;
}

/** Prix courant, éventuellement accompagné du prix barré. Pas de badge ici - voir `DiscountBadge`. */
export const PriceBlock: React.FC<PriceBlockProps> = ({
	price,
	compareAtPrice,
	currencySymbol,
	formatPrice,
	className,
}) => {
	const show = (amount: number) =>
		formatPrice ? formatPrice(amount) : formatCurrency_FR(amount, currencySymbol);
	const onSale = compareAtPrice != null && compareAtPrice > price;

	return (
		<div className={className}>
			<span className="text-sm font-semibold tracking-wide whitespace-nowrap">
				{show(price)}
			</span>
			{onSale && (
				<span className="ml-2 text-sm text-grey line-through whitespace-nowrap">
					{show(compareAtPrice)}
				</span>
			)}
		</div>
	);
};

/** Pastille "-N%", à poser en `absolute` sur le visuel produit. */
export const DiscountBadge: React.FC<{
	price: number;
	compareAtPrice?: number;
	className?: string;
}> = ({ price, compareAtPrice, className }) => {
	if (compareAtPrice == null || compareAtPrice <= price) return null;

	const percent = Math.round((1 - price / compareAtPrice) * 100);

	return (
		<span
			className={`z-20 px-3 py-1 text-xs font-medium text-white rounded-full bg-destructive ${className ?? ""}`}
		>
			-{percent}%
		</span>
	);
};
