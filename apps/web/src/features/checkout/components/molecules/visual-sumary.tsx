import { useCartStore } from "@prettyfull/store";
import { formatCurrency_FR } from "@prettyfull/utils";
import Image from "next/image";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { CartItemType } from "../../types";

const VisualSummary = ({
	item,
	currency,
}: {
	item: CartItemType;
	currency: string;
}) => {
	const removeItem = useCartStore((state) => state.removeItem);

	const handleRemove = (itemId: string) => {
		removeItem(itemId);
	};
	return (
		<div className="flex space-x-8 sm:space-x-10">
			<div className="relative w-40 h-44 bg-gray-100 rounded-2xl aspect-square">
				<div className="overflow-hidden w-40 h-44 rounded-2xl">
					<Image
						src={item.image}
						alt={item.name}
						width={100}
						height={100}
						className="object-top object-cover w-40 h-44 rounded-2xl"
					unoptimized
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
							className="hidden p-2 rounded-full cursor-pointer lg:block hover:bg-gray-100"
						>
							<CloseIcon size={15} className="text-gray-400" />
						</button>
					</div>
				</div>
				<button
					onClick={() => handleRemove(item.id)}
					className="block p-2 h-fit rounded-full cursor-pointer lg:hidden hover:bg-gray-100"
				>
					<CloseIcon size={15} className="text-gray-400" />
				</button>
			</div>
		</div>
	);
};

export default VisualSummary;
