"use client";

import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import { StoreCart } from "@medusajs/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";
import { formatCurrency_FR } from "../../../../../../../packages/utils/lib/format-curency";
import { QuantitySelector } from "../molecules/quantity-selector";

const CartItems = ({
	cart,
	isLoading,
}: {
	cart: StoreCart;
	isLoading: boolean;
}) => {
	const cartId = localStorage.getItem("cart_id");

	const queryClient = useQueryClient();
	const [loadingId, setLoadingId] = useState<string | null>(null);

	const handleRemove = async (itemId: string) => {
		try {
			setLoadingId(itemId);
			await sdk.store.cart.deleteLineItem(cartId as string, itemId);
			queryClient.invalidateQueries({
				queryKey: [CART_ITEMS_CART, cartId as string],
			});
		} finally {
			setLoadingId(null);
		}
	};

	if (isLoading) {
		return <div className="py-8 text-center">Chargement...</div>;
	}

	if (!cart?.items || cart.items.length === 0) {
		return (
			<div className="py-8 text-center text-gray-500">
				Votre panier est vide
			</div>
		);
	}

	return (
		<div className="space-y-12">
			{cart.items.map((item) => {
				const imageSrc = item.thumbnail || "/assets/product_1.jpg";

				return (
					<div
						key={item.id}
						className="flex flex-row items-start justify-between gap-6 pb-10 border-b border-gray-200"
					>
						<div
							className="relative w-48 rounded-md h-58 aspect-square "
							style={{
								backgroundImage: `url(${imageSrc})`,
								backgroundSize: "cover",
								backgroundPosition: "top",
							}}
						>
							<button className="absolute flex p-2 transition border rounded-full top-4 right-4 hover:bg-gray-100 md:hidden">
								<Heart width={8} height={8} />
							</button>
						</div>

						{/* 🧾 Détails produit */}
						<div className="flex flex-col justify-between flex-1 h-58">
							<div className="flex justify-between w-full">
								{/* Ligne titre + prix */}
								<div className="flex items-start justify-between w-full max-md:flex-col-reverse ">
									<h4 className="text-[1.7rem]! font-medium text-gray-900 font-manrope">
										{item.product_title}
									</h4>
									<p className="text-lg font-semibold text-gray-800 whitespace-nowrap">
										{formatCurrency_FR(item.unit_price)}
									</p>
								</div>

								<button
									onClick={() => handleRemove(item.id)}
									className="p-2 transition rounded-full h-fit hover:bg-gray-100 md:hidden"
								>
									<CloseIcon size={18} />
								</button>
							</div>

							{/* Description + variantes */}
							<p className="mt-1 text-sm text-gray-500 whitespace-nowrap ">
								{item.variant_title || "Variante"}
							</p>

							{/* Bloc quantité + actions */}
							<div className="flex flex-col items-start justify-between gap-3 mt-2 h-fit md:h-full ">
								<QuantitySelector
									productId={item.id || ""}
									initialQuantity={item.quantity}
									selectedVariants={{}}
									cartId={cart.id}
								/>{" "}
								<div className="items-center hidden gap-4 md:flex">
									<button className="p-2 transition border rounded-full hover:bg-gray-100">
										<Heart width={18} height={18} />
									</button>

									<button
										onClick={() => handleRemove(item.id)}
										disabled={loadingId === item.id}
										className={`border rounded-full p-2 transition ${
											loadingId === item.id
												? "opacity-50 cursor-not-allowed"
												: "hover:bg-gray-100"
										}`}
									>
										<TrashIcon size={18} />
									</button>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default CartItems;
