import { useDisplayCurrency } from "@/hooks/use-display-currency";
import { useCartStore } from "@prettyfull/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { CartItemType } from "../../types";

/** Ligne produit compacte du récapitulatif : vignette, nom, prix, retrait. */
const VisualSummary = ({ item }: { item: CartItemType }) => {
	const t = useTranslations("CheckoutPage.summary");
	const removeItem = useCartStore((state) => state.removeItem);
	const { format } = useDisplayCurrency();
	const currency = item.currency ?? "xof";

	return (
		<div className="flex gap-4 items-center">
			<div className="relative shrink-0">
				<div className="overflow-hidden size-[6.4rem] rounded-md border border-(--color-surface-border) bg-(--color-surface-card)">
					<Image
						src={item.image}
						alt={item.name}
						width={64}
						height={64}
						className="object-cover size-full"
						unoptimized
					/>
				</div>
				<span className="flex absolute -top-2 -right-2 justify-center items-center px-1 min-w-[2rem] h-[2rem] text-[1.1rem] font-semibold text-white rounded-full bg-(--color-ink)">
					{item.quantity}
				</span>
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-[1.4rem] font-medium leading-snug text-(--color-ink) line-clamp-2">
					{item.name}
				</p>
				<p className="mt-0.5 text-[1.25rem] text-(--color-surface-muted)">
					{t("unitPriceLabel")} : {format(item.price, currency)}
				</p>
			</div>

			<div className="flex flex-col gap-1 items-end shrink-0">
				<span className="text-[1.4rem] font-semibold text-(--color-ink) whitespace-nowrap">
					{format(item.price * item.quantity, currency)}
				</span>
				<button
					type="button"
					onClick={() => removeItem(item.id)}
					aria-label={t("remove", { name: item.name })}
					className="p-1 rounded cursor-pointer text-(--color-surface-muted) hover:text-(--color-ink) hover:bg-(--color-surface-card)"
				>
					<CloseIcon size={12} />
				</button>
			</div>
		</div>
	);
};

export default VisualSummary;
