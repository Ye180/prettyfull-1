"use client";

import { FC } from "react";
import { CartSummaryType } from "./types";
import { Button } from "@prettyfull/ui";

interface Props {
  summary: CartSummaryType;
}

const CartSummary: FC<Props> = ({ summary }) => {
  return (
    <div className="bg-white p-6  w-full  md:w-1/3">
      <div className="font-bold py-12 text-2xl">Summary</div>
      <div className="mb-6 space-y-8">
      <div className="flex justify-between text-md ">
        <span>Subtotal</span>
        <span>${summary.subtotal}</span>
      </div>
      <div className="flex justify-between text-md ">
        <span>Estimate Shipping Costs</span>
        <span>${summary.shipping}</span>
      </div>
      
      <div className="flex justify-between text-md ">
        <span>Estimate Duties And Taxes</span>
        <span>{summary.taxes ? `$${summary.taxes}` : "-"}</span>
      </div>
      <hr className="my-3 text-gray-300" />
      <div className="flex justify-between font-semibold text-lg mb-4">
        <span>Total</span>
        <span>${summary.total}</span>
      </div>
      <hr className="my-3 text-gray-300" />
</div>
      <Button
                    variant="secondary"
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    Checkout
                  </Button>
    </div>
  );
};

export default CartSummary;
