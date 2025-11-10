'use client';

import { Button } from '@prettyfull/ui';

interface CartSummaryProps {
	subtotal?: number;
	taxes?: number;
	shipping?: number;
	total?: number;
	currency?: string;
}

const CartSummary = ({
	subtotal = 0,
	taxes = 0,
	shipping = 0,
	total = 0,
	currency = 'USD',
}: CartSummaryProps) => {
	return (
		<div className="w-full md:w-[320px]  p-6 bg-white h-fit">
			<h3 className="text-lg font-semibold mb-4">Summary</h3>

			<div className="space-y-3 text-sm text-gray-700">
				<div className="flex justify-between">
					<span>Subtotal</span>
					<span>
						{currency} {subtotal.toLocaleString()}
					</span>
				</div>

				<div className="flex justify-between">
					<span>Estimate Shipping Costs</span>
					<span>
						{currency} {shipping.toLocaleString()}
					</span>
				</div>

				<div className="flex justify-between">
					<span>Estimate Duties And Taxes</span>
					<span>-</span>
				</div>
			</div>

			<hr className="my-4" />

			<div className="flex justify-between text-base font-semibold">
				<span>Total</span>
				<span>
					{currency} {total.toLocaleString()}
				</span>
			</div>

			<Button className="w-full mt-6 py-3 rounded-full text-base font-medium bg-black hover:bg-gray-700 transition">
				Checkout
			</Button>
		</div>
	);
};

export default CartSummary;
