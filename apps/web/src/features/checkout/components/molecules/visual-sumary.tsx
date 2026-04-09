import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { CartItemType } from "../../types";

const VisualSummary = ({
	item,
	currency,
}: {
	item: CartItemType;
	currency: string;
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
	return (
		<div className="flex space-x-8 sm:space-x-10">
			<div className="relative w-40 h-44 bg-gray-100 rounded-md aspect-square">
				<div className="overflow-hidden w-40 h-44 rounded-md">
					<Image
						src={item.image + "?view=1"}
						alt={item.name}
						width={100}
						height={100}
						className="object-top w-40 rounded h-58"
					/>
				</div>

				<p className="absolute flex items-center justify-center font-semibold text-white bg-black rounded-full -top-4 -right-5 size-12 text-[1.4rem]">
					{item.quantity}
				</p>
			</div>

			<div className="flex flex-row justify-between space-y-4 w-full lg:flex-col">
				<div className="space-y-2 text-[1.5rem]">
					<h5 className="font-semibold text-[2.2rem]! tracking-wider whitespace-nowrap">
						{item.name}
					</h5>
					<p className="text-gray-500 text-md line-clamp-1">
						{item.description || ""}
					</p>
					<p className="text-gray-500 text-md">
						Unit price: {formatCurrency_FR(item.price, currency)}
					</p>

					<div className="flex gap-10 justify-start items-center">
						<p className="text-gray-500 text-md">
							Size: <span className="uppercase">{item.size || "-"}</span>
						</p>
						<button
							onClick={() => handleRemove(item.id)}
							disabled={loadingId === item.id}
							className={`cursor-pointer hidden lg:block ${
								loadingId === item.id
									? "opacity-50 cursor-not-allowed"
									: "hover:bg-gray-100 rounded-full p-2"
							}`}
						>
							<CloseIcon size={15} className="text-gray-400" />
						</button>
					</div>
				</div>
				<button
					onClick={() => handleRemove(item.id)}
					disabled={loadingId === item.id}
					className={`cursor-pointer block h-fit lg:hidden ${
						loadingId === item.id
							? "opacity-50 cursor-not-allowed"
							: "hover:bg-gray-100 rounded-full p-2"
					}`}
				>
					<CloseIcon size={15} className="text-gray-400" />
				</button>
			</div>
		</div>
	);
};

export default VisualSummary;
