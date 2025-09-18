"use client";

import { FC } from "react";
import { PlusIcon } from "../../../../../packages/ui/src/icons/plus.icon";
import { MinusIcon } from "../../../../../packages/ui/src/icons/minus.icon";

interface Props {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantitySelector: FC<Props> = ({ value, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center space-x-2 rounded-full bg-gray-100 w-fit p-2">
      <button
        onClick={onDecrease}
        className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-300"
      >
        <MinusIcon size={20} />
      </button>
      <span className="text-2xl font-medium">{value}</span>
      <button
        onClick={onIncrease}
        className="w-16 h-16 flex items-center justify-center rounded-full bg-black hover:bg-black/80 transition"
      >
        <PlusIcon size={20} color="white" />
      </button>
    </div>
  );
};

export default QuantitySelector;
