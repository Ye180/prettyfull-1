"use client";

import client from "@/shared/lib/client";
import { useState } from "react";
import type { CartItem } from "../../../../../../../packages/store/src/use-cart-store";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";
import { useRemoveCartItem } from "../../api/remove-item-from-cart";
import { QuantitySelector } from "../molecules/quantity-selector";

const getImageUrl = (path?: string) => {
	if (!path) return "/assets/product_1.jpg";
	if (path.startsWith("http")) return path;
	const baseUrl = client.defaults.baseURL?.replace("/api/v1", "") || "";
	return `${baseUrl}${path}`;
};

// 🧩 Génère une clé unique par produit + variantes
const makeUniqueKey = (item: CartItem) =>
	`${item.productId}-${Object.entries(item.selectedVariants || {})
		.map(([k, v]) => `${k}-${v}`)
		.join("-")}`;

const CartItems = ({ items }: { items: CartItem[] }) => {
	const removeItemMutation = useRemoveCartItem();
	const [loadingId, setLoadingId] = useState<string | null>(null);

	const handleRemove = async (params: {
		productId: string;
		selectedVariants?: Record<string, string>;
	}) => {
		try {
			setLoadingId(params.productId);
			await removeItemMutation.mutateAsync(params);
		} finally {
			setLoadingId(null);
		}
	};

	return (
		<div className="space-y-12">
			{items.map((item: CartItem) => {
				const { product, selectedVariants } = item;
				const imageSrc = getImageUrl(product?.image);
				const color = selectedVariants?.color || "-";
				const size = selectedVariants?.size || "-";
				const name =
					typeof product?.name === "string"
						? product.name
						: (product?.name as { fr?: string })?.fr || "Produit";

				return (
					<div
						key={makeUniqueKey(item)}
						className="flex flex-row items-start justify-between gap-6 pb-10 border-b border-gray-200"
					>
						{/* 🖼️ Image du produit */}
						{/* <div className="shrink-0">
							<Image
								src={imageSrc}
								alt={name}
								width={150}
								height={200}
								className="object-cover border border-gray-100 rounded-md "
							/>
						</div> */}

						<div
							className="relative w-64 rounded-md h-84 aspect-square "
							style={{
								backgroundImage: `url(${imageSrc || "/assets/product_1.jpg"})`,
								backgroundSize: "cover",
								backgroundPosition: "top",
							}}
						>
							<button className="absolute flex p-2 transition border rounded-full top-4 right-4 hover:bg-gray-100 md:hidden">
								<Heart width={12} height={12} />
							</button>
						</div>

						{/* 🧾 Détails produit */}
						<div className="flex flex-col justify-between flex-1 h-84">
							<div className="flex justify-between w-full">
								{/* Ligne titre + prix */}
								<div className="flex items-start justify-between w-full max-md:flex-col-reverse ">
									<h4 className="text-[2rem]! font-medium text-gray-900 font-manrope">
										{name}
									</h4>
									<p className="text-lg font-semibold text-gray-800 whitespace-nowrap">
										{item.unitPrice?.amount?.toLocaleString()}{" "}
										{item.unitPrice?.currency || "FCFA"}
									</p>
								</div>

								<button
									onClick={() => handleRemove(item)}
									className="p-2 transition rounded-full h-fit hover:bg-gray-100 md:hidden"
								>
									<CloseIcon size={18} />
								</button>
							</div>

							{/* Description + variantes */}
							<p className="mt-1 text-sm text-gray-500 whitespace-nowrap ">
								{product?.description ||
									"Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
							</p>

							<div className="mt-1 space-y-2 text-sm text-gray-500">
								<p>
									Color : <span className="capitalize">{color}</span>
								</p>
								<p>
									Size : <span>{size}</span>
								</p>
							</div>

							{/* Bloc quantité + actions */}
							<div className="flex flex-col items-start justify-between gap-3 mt-2 h-fit md:h-full ">
								<QuantitySelector
									productId={item.productId}
									initialQuantity={item.quantity}
									selectedVariants={item.selectedVariants}
								/>

								<div className="items-center hidden gap-4 md:flex">
									<button className="p-2 transition border rounded-full hover:bg-gray-100">
										<Heart width={18} height={18} />
									</button>

									<button
										onClick={() =>
											handleRemove({
												productId: item.productId,
												selectedVariants: item.selectedVariants,
											})
										}
										disabled={loadingId === item.productId}
										className={`border rounded-full p-2 transition ${
											loadingId === item.productId
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
