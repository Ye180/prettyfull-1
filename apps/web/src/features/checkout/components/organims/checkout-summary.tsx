"use client";

import { useGetItemsCart } from "@/features/cart/api/medusa/get-items-cart";
import { DropdownMenuSeparator } from "@prettyfull/ui";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import VisualSummary from "../molecules/visual-sumary";

const CheckoutSummary = ({ currency }: { currency: string }) => {
	const t = useTranslations("CheckoutPage.summary");

	const cartId = localStorage.getItem("cart_id");
	const { data: cart, isLoading } = useGetItemsCart(cartId as string);

	//Add elements dans le local storage
	// const [checkoutSummary, setCheckoutSummary] = useLocalStorage(
	// 	"checkout_summary",
	// 	{
	// 		subtotal: 0,
	// 		shipping: 0,
	// 		taxes: 0,
	// 		total: 0,
	// 	}
	// );

	// // Set the checkout summary data when cart is loaded
	// useEffect(() => {
	// 	if (cart) {
	// 		setCheckoutSummary({
	// 			subtotal: cart.item_subtotal ?? 0,
	// 			shipping: cart.shipping_total ?? 0,
	// 			taxes: cart.item_tax_total ?? 0,
	// 			total: cart.item_total ?? 0,
	// 		});
	// 	}
	// }, [cart, setCheckoutSummary]);

	return (
		<div className="py-6 w-full bg-white">
			{/* SECTION: Produits visuels */}
			<div className="flex flex-col pb-8 space-y-10">
				{cart?.items?.map((item) => (
					<VisualSummary
						key={item.id}
						item={{
							id: item.id,
							name: item.product_title ?? "Unknown product",
							description: item.product?.description || "",
							price: item.unit_price,
							size: item.variant_title || "",
							image: item.thumbnail || "",
							quantity: item?.quantity,
						}}
						currency={currency}
					/>
				))}
			</div>

			{/* SECTION: Résumé des coûts */}
			<h3 className="py-8 text-2xl! lg:text-3xl! ">{t("title")}</h3>
			<div className="mb-6 space-y-8">
				<div className="space-y-8">
					<div className="flex justify-between text-md">
						<span>{t("subtotal")}</span>
						<span>
							{formatCurrency_FR(cart?.item_subtotal as number, currency)}
						</span>
					</div>

					<div className="flex justify-between text-md">
						<span>{t("shipping")}</span>
						<span>
							{formatCurrency_FR(cart?.shipping_total as number, currency)}
						</span>
					</div>

					<div className="flex justify-between text-md">
						<span>{t("taxes")}</span>
						<span>
							{formatCurrency_FR(cart?.item_tax_total as number, currency)}
						</span>
					</div>
				</div>

				<DropdownMenuSeparator />

				<div className="flex justify-between py-6 text-lg font-semibold">
					<span>{t("total")}</span>
					<span>{formatCurrency_FR(cart?.total as number, currency)}</span>
				</div>
			</div>

			<DropdownMenuSeparator />
		</div>
	);
};

export default CheckoutSummary;
