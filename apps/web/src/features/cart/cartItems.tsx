"use client";

import { FC } from "react";
import { CartItemType } from "./types";
import { Heart } from "../../../../../packages/ui/src/icons/heart.icon";
import { TrashIcon } from "../../../../../packages/ui/src/icons/trash.icon";
import QuantitySelector from "./quantitySelector";
import Image from "next/image";

interface Props {
  item: CartItemType;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItem: FC<Props> = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="flex justify-between py-6 border-b border-gray-200">
      <div className="flex space-x-4">
     <div className="relative w-auto h-auto">
        <Image
          src={item.image}
          alt={item.name}
          width={246}   
          height={246}  
          className="object-cover rounded-md"
        />
      </div>

        <div className="flex flex-col  justify-between">
          <div className="space-y-4">
            <h5 className="font-semibold text-sm">{item.name}</h5>
            <p className="text-gray-500 text-md">{item.description}</p>
            <p className="text-gray-500 text-md">Color: {item.color}</p>
            <p className="text-gray-500 text-md">Size: {item.size}</p>
          </div>
          <QuantitySelector
            value={item.quantity}
            onIncrease={() => onIncrease(item.id)}
            onDecrease={() => onDecrease(item.id)}
          />
          <div className="flex space-x-4  mt-2">
            <div className="rounded-full border p-4 border-gray-200 hover:bg-gray-100 transition">
            <Heart className="w-10 h-10 cursor-pointer hover:text-black" />
            </div>
            <div className="rounded-full border p-4 border-gray-200 hover:bg-gray-100 transition">

              <TrashIcon
                className="w-10 h-10 cursor-pointer hover:text-red-500"
                onClick={() => onRemove(item.id)}
              />
            </div>

          </div>
        </div>
      </div>

      <div className="text-right font-semibold">${item.price}</div>
    </div>
  );
};

export default CartItem;
