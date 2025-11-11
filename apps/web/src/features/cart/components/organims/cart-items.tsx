"use client";

import client from "@/shared/lib/client";
import Image from "next/image";
import { useState } from "react";
import type { CartItem } from "../../../../../../../packages/store/src/use-cart-store";
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
						className="flex flex-col gap-6 pb-10 border-b border-gray-200 sm:flex-row sm:justify-between sm:items-start"
					>
						{/* 🖼️ Image du produit */}
						<div className="flex-shrink-0">
							<Image
								src={imageSrc}
								alt={name}
								width={150}
								height={150}
								className="object-cover border border-gray-100 rounded-md"
							/>
						</div>

						{/* 🧾 Détails produit */}
						<div className="flex flex-col justify-between flex-1">
							{/* Ligne titre + prix */}
							<div className="flex items-start justify-between">
								<h4 className="text-lg font-semibold text-gray-900">{name}</h4>
								<p className="text-lg font-semibold text-gray-800 whitespace-nowrap">
									{item.unitPrice?.amount?.toLocaleString()}{" "}
									{item.unitPrice?.currency || "FCFA"}
								</p>
							</div>

							{/* Description + variantes */}
							<p className="mt-1 text-sm text-gray-500">
								{product?.description || ""}
							</p>
							<div className="mt-1 text-sm text-gray-500 space-y-0.5">
								<p>
									Color : <span className="capitalize">{color}</span>
								</p>
								<p>
									Size : <span>{size}</span>
								</p>
							</div>

							{/* Bloc quantité + actions */}
							<div className="flex flex-col items-start gap-3 mt-4">
								<QuantitySelector
									productId={item.productId}
									initialQuantity={item.quantity}
									selectedVariants={item.selectedVariants}
								/>

								<div className="flex items-center gap-4">
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
