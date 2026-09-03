"use client";

import { useRegionStore } from "@/stores/useRegion";
import { useCartStore, type CartItem } from "@prettyfull/store";
import Image from "next/image";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";
import { formatCurrency_FR } from "../../../../../../../packages/utils/lib/format-curency";
import { QuantitySelector } from "../molecules/quantity-selector";

const CartItems = ({ items }: { items: CartItem[] }) => {
	const removeItem = useCartStore((state) => state.removeItem);
	const regions = useRegionStore((state) => state.region);

	if (!items || items.length === 0) {
		return (
			<div className="py-8 text-center text-gray-500">
				Votre panier est vide
			</div>
		);
	}

	return (
		<div className="space-y-12">
			{items.map((item) => {
				const imageSrc = item.product.image || "/assets/product_1.jpg";
				const variantLabel = Object.values(item.selectedVariants || {}).join(" / ");
				const unitPrice = item.unitPrice?.amount ?? item.product.price?.amount ?? 0;

				return (
					<div
						key={item.productId}
						className="flex flex-row items-start justify-between gap-6  border-b border-gray-200 h-76!"
					>
						<div className="relative w-48 h-44 rounded-md md:h-58 aspect-square">
							<Image
								src={imageSrc}
								alt={item.product.name}
								width={230}
								height={230}
								className="object-contain rounded-md"
								unoptimized
							/>

							<button className="flex absolute top-4 right-4 p-2 rounded-full border transition hover:bg-gray-100 md:hidden">
								<Heart width={8} height={8} />
							</button>
						</div>

						<div className="flex flex-col flex-1 justify-between h-58">
							<div className="flex justify-between w-full">
								<div className="flex justify-between items-start w-full max-md:flex-col-reverse">
									<h4 className="text-[1.7rem]! font-medium text-gray-900 font-manrope">
										{item.product.name}
									</h4>
									<p className="text-lg font-semibold text-gray-800 whitespace-nowrap">
										{formatCurrency_FR(
											unitPrice,
											regions?.currency_code === "xof" ? "FCFA" : "$",
										)}
									</p>
								</div>

								<button
									onClick={() => removeItem(item.productId)}
									className="p-2 rounded-full transition h-fit hover:bg-gray-100 md:hidden"
								>
									<CloseIcon size={18} />
								</button>
							</div>

							<p className="mt-1 text-sm text-gray-500 uppercase whitespace-nowrap">
								{variantLabel || "Variante unique"}
							</p>

							<div className="flex flex-col gap-3 justify-between items-start mt-2 h-fit md:h-full">
								<QuantitySelector
									productId={item.productId}
									initialQuantity={item.quantity}
								/>
								<div className="hidden gap-4 items-center md:flex">
									<button className="p-2 rounded-full border transition hover:bg-gray-100">
										<Heart width={18} height={18} />
									</button>

									<button
										onClick={() => removeItem(item.productId)}
										className="p-2 rounded-full border transition hover:bg-gray-100"
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
