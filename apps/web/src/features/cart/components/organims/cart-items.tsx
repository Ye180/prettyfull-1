"use client";

import { FC } from "react";
import { CartItemType } from "../../types";
import EditItems from "../molecules/edit-items";
import QuantitySelector from "../molecules/quantity-selector";

interface Props {
	item: CartItemType;
	onIncrease: (id: string) => void;
	onDecrease: (id: string) => void;
	onRemove: (id: string) => void;
}

const CartItem: FC<Props> = ({ item, onIncrease, onDecrease, onRemove }) => {
	return (
		<div className="flex justify-between py-10 border-b border-gray-200">
			<div className="flex space-x-4 sm:space-x-8">
				<div
					className="relative h-[20rem] w-[15rem] sm:w-[20rem] sm:h-[22rem] rounded-md overflow-hidden bg-gray-100 aspect-square"
					style={{
						backgroundImage: `url(/assets/product_1.jpg)`,
						backgroundSize: "cover",
						backgroundPosition: "top",
					}}
				/>

				<div className="flex flex-col justify-between space-y-4">
					<div className="space-y-2 text-[1.5rem]">
						<h5 className="font-semibold !text-[2.2rem] tracking-wider whitespace-nowrap">
							{item.name}
						</h5>
						<p className="text-gray-500 text-md whitespace-nowrap line-clamp-1 truncate max-sm:w-[17rem]">
							{item.description}
						</p>
						<p className="text-gray-500 text-md">Color: {item.color}</p>
						<p className="text-gray-500 text-md">Size: {item.size}</p>
					</div>
					<QuantitySelector
						value={item.quantity}
						onIncrease={() => onIncrease(item.id)}
						onDecrease={() => onDecrease(item.id)}
					/>
					<EditItems
						onRemove={() => onRemove(item.id)}
						className="max-sm:hidden"
					/>
				</div>
			</div>
			<div className="flex flex-col items-end justify-between">
				<div className="font-semibold text-right">${item.price}</div>
				<div className="flex pb-4 ">
					<EditItems
						onRemove={() => onRemove(item.id)}
						className="flex-col max-sm:flex sm:hidden gap-y-8"
					/>
				</div>
			</div>
		</div>
	);
};

export default CartItem;
