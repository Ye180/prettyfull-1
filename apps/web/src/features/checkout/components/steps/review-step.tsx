"use client";

import { useGetItemsCart } from "@/features/cart/api/medusa/get-items-cart";
import { Button, Checkbox } from "@prettyfull/ui";
import { cn, formatCurrency_FR } from "@prettyfull/utils";
import Image from "next/image";
import { useState } from "react";
import { useCompleteCart } from "../../api/complete-cart";
import { useCheckoutStep } from "../../hooks/use-checkout-step";
import { useCheckoutStore } from "../../stores/use-checkout-store";

interface ReviewStepProps {
	cartId: string | null;
	onPlaceOrder?: (orderId: string) => void;
}

export function ReviewStep({ cartId, onPlaceOrder }: ReviewStepProps) {
	const { isStepCompleted, isStepActive } = useCheckoutStep();
	const { reset: resetCheckoutStore } = useCheckoutStore();
	const [isLoading, setIsLoading] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isOpen = isStepActive("review");
	const canAccess = isStepCompleted("payment");

	// Get cart data
	const { data: cart } = useGetItemsCart(cartId as string);
	const completeCart = useCompleteCart();

	const handlePlaceOrder = async () => {
		if (!termsAccepted || !cartId) return;

		setIsLoading(true);
		setError(null);

		try {
			// Complete cart and create order via Medusa API
			const order = await completeCart.mutateAsync({ cartId });

			// Reset checkout store
			resetCheckoutStore();

			onPlaceOrder?.(order.id);
		} catch (err) {
			console.error("Failed to place order:", err);
			setError("Failed to place order. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white">
			{/* Header */}
			<div className="flex flex-row justify-between items-center mb-6">
				<h2
					className={cn(
						"flex flex-row font-medium gap-x-2 items-center text-3xl! tracking-wider",
						{
							"opacity-50 pointer-events-none select-none": !canAccess,
						}
					)}
				>
					Review
				</h2>
			</div>

			{/* Content */}
			{isOpen && canAccess ? (
				<div className="space-y-6">
					<p className="text-sm text-gray-600">
						Please review your order before placing it
					</p>

					{/* Order Items Summary */}
					<div className="p-8 space-y-4 bg-gray-50 rounded-lg">
						<h3 className="flex flex-row font-medium gap-x-2 items-center text-2xl! tracking-wider">
							Order Items ({cart?.items?.length || 0})
						</h3>
						<div className="space-y-4">
							{cart?.items?.map((item: any) => (
								<div
									key={item.id}
									className="flex justify-between items-center text-sm"
								>
									<div className="flex gap-4 items-center">
										<div className="overflow-y-hidden w-32 rounded-md h-38">
											{item.thumbnail && (
												<Image
													src={item.thumbnail}
													alt={item.product_title}
													width={100}
													height={100}
													className="object-cover w-32 h-52 bg-amber-400 rounded"
												/>
											)}
										</div>

										<div className="space-y-4">
											<p className="font-medium">{item.product_title}</p>
											<p className="font-semibold text-gray-500">
												{item.variant_title} × {item.quantity}
											</p>
										</div>
									</div>
									<span className="font-medium">
										{formatCurrency_FR(item.unit_price * item.quantity)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Totals */}
					<div className="pt-4 space-y-4 border-t border-gray-200">
						<div className="flex justify-between py-3 text-sm">
							<span>Subtotal</span>
							<span>{formatCurrency_FR(cart?.item_subtotal || 0)}</span>
						</div>
						<div className="flex justify-between py-3 text-sm">
							<span>Shipping</span>
							<span>{formatCurrency_FR(cart?.shipping_total || 0)}</span>
						</div>
						<div className="flex justify-between py-3 text-sm">
							<span>Taxes</span>
							<span>{formatCurrency_FR(cart?.item_tax_total || 0)}</span>
						</div>
						<div className="flex justify-between py-3 text-lg font-semibold border-t border-gray-200">
							<span>Total</span>
							<span>{formatCurrency_FR(cart?.total || 0)}</span>
						</div>
					</div>

					{/* Terms */}
					<div className="flex gap-3 items-start pt-4">
						{/* <input
							type="checkbox"
							id="terms"
							checked={termsAccepted}
							onChange={(e) => setTermsAccepted(e.target.checked)}
							className="mt-1 w-4 h-4 text-black rounded border-gray-300 focus:ring-black"
						/> */}

						<Checkbox
							checked={termsAccepted}
							onCheckedChange={(checked) => setTermsAccepted(checked === true)}
							id="terms"
						/>
						<label htmlFor="terms" className="text-sm text-gray-600">
							By clicking the Place Order button, you confirm that you have
							read, understand and accept our Terms of Use, Terms of Sale and
							Returns Policy.
						</label>
					</div>

					{error && <p className="text-sm text-red-600">{error}</p>}

					<Button
						onClick={handlePlaceOrder}
						className="py-6 w-full"
						disabled={!termsAccepted || isLoading || !cartId}
					>
						{isLoading ? "Placing order..." : "Place Order"}
					</Button>
				</div>
			) : !canAccess ? (
				<p className="text-sm text-gray-400">
					Complete the previous steps to continue
				</p>
			) : null}
		</div>
	);
}

export default ReviewStep;
