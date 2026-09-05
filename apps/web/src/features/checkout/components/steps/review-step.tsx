"use client";

import { useGetShippingOptions } from "@/features/checkout/api/get-shipping-options";
import { useCartStore } from "@prettyfull/store";
import { Button, Checkbox } from "@prettyfull/ui";
import { cn, formatCurrency_FR } from "@prettyfull/utils";
import Image from "next/image";
import { useState } from "react";
import { useCompleteCart } from "../../api/complete-cart";
import { useCheckoutStep } from "../../hooks/use-checkout-step";
import { useCheckoutStore } from "../../stores/use-checkout-store";

const TAX_RATE = 0.18;

interface ReviewStepProps {
	cartId: string | null;
	onPlaceOrder?: (orderId: string, confirmationToken?: string) => void;
}

export function ReviewStep({ cartId, onPlaceOrder }: ReviewStepProps) {
	const { isStepCompleted, isStepActive } = useCheckoutStep();
	const { reset: resetCheckoutStore } = useCheckoutStore();
	const selectedShippingOptionId = useCheckoutStore(
		(state) => state.selectedShippingOptionId,
	);
	const items = useCartStore((state) => state.items);
	const [isLoading, setIsLoading] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isOpen = isStepActive("review");
	const canAccess = isStepCompleted("payment");

	const completeCart = useCompleteCart();

	const subtotal = items.reduce(
		(acc, item) => acc + (item.unitPrice?.amount ?? item.product.price?.amount ?? 0) * item.quantity,
		0,
	);
	const { data: shippingOptions } = useGetShippingOptions("cart");
	const shipping =
		shippingOptions?.find((option) => option.id === selectedShippingOptionId)?.amount ?? 0;
	const taxes = subtotal * TAX_RATE;
	const total = subtotal + shipping + taxes;

	const handlePlaceOrder = async () => {
		if (!termsAccepted || !cartId) return;

		setIsLoading(true);
		setError(null);

		try {
			const order = await completeCart.mutateAsync();
			resetCheckoutStore();
			onPlaceOrder?.(order.orderId, order.confirmationToken);
		} catch (err) {
			// L'API nomme l'article épuisé et le disponible restant : afficher
			// son message est bien plus actionnable qu'un texte générique.
			console.error("Échec du passage en commande :", err);
			setError(
				err instanceof Error
					? err.message
					: "La commande n'a pas pu être passée. Réessayez.",
			);
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
							Order Items ({items.length})
						</h3>
						<div className="space-y-4">
							{items.map((item) => {
								const variantLabel = Object.values(item.selectedVariants || {}).join(" / ");
								const unitPrice = item.unitPrice?.amount ?? item.product.price?.amount ?? 0;
								return (
									<div
										key={item.productId}
										className="flex justify-between items-center text-sm"
									>
										<div className="flex gap-4 items-center">
											<div className="overflow-y-hidden w-32 rounded-md h-38">
												{item.product.image && (
													<Image
														src={item.product.image}
														alt={item.product.name}
														width={100}
														height={100}
														className="object-cover w-32 h-52 bg-amber-400 rounded"
													unoptimized
													/>
												)}
											</div>

											<div className="space-y-4">
												<p className="font-medium">{item.product.name}</p>
												<p className="font-semibold text-gray-500">
													{variantLabel || "Unique"} × {item.quantity}
												</p>
											</div>
										</div>
										<span className="font-medium">
											{formatCurrency_FR(unitPrice * item.quantity)}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* Totals */}
					<div className="pt-4 space-y-4 border-t border-gray-200">
						<div className="flex justify-between py-3 text-sm">
							<span>Subtotal</span>
							<span>{formatCurrency_FR(subtotal)}</span>
						</div>
						<div className="flex justify-between py-3 text-sm">
							<span>Shipping</span>
							<span>{formatCurrency_FR(shipping)}</span>
						</div>
						<div className="flex justify-between py-3 text-sm">
							<span>Taxes</span>
							<span>{formatCurrency_FR(taxes)}</span>
						</div>
						<div className="flex justify-between py-3 text-lg font-semibold border-t border-gray-200">
							<span>Total</span>
							<span>{formatCurrency_FR(total)}</span>
						</div>
					</div>

					{/* Terms */}
					<div className="flex gap-3 items-start pt-4">
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
