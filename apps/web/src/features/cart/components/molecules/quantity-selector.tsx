"use client";

import { FC } from "react";
import { MinusIcon } from "../../../../../../../packages/ui/src/icons/minus.icon";
import { PlusIcon } from "../../../../../../../packages/ui/src/icons/plus.icon";

interface Props {
	value: number;
	onIncrease: () => void;
	onDecrease: () => void;
}

const QuantitySelector: FC<Props> = ({ value, onIncrease, onDecrease }) => {
	return (
		<div className="flex items-center space-x-4 rounded-full bg-gray-100 w-fit p-3">
			<button
				onClick={onDecrease}
				className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 cursor-pointer"
			>
				<MinusIcon size={20} />
			</button>
			<span className="text-lg font-medium w-12 text-center">{value}</span>
			<button
				onClick={onIncrease}
				className="w-12 h-12 flex items-center justify-center rounded-full bg-black hover:bg-black/80 transition cursor-pointer"
			>
				<PlusIcon size={20} color="white" />
			</button>
		</div>
	);
};

export default QuantitySelector;
