"use client";

import { Button } from "@prettyfull/ui";
import { cn, formatCurrency_FR } from "@prettyfull/utils";
import { useState } from "react";
import { useGetShippingOptions } from "../../api/get-shipping-options";
import { useSetShippingMethod } from "../../api/set-shipping-method";
import { useCheckoutStep } from "../../hooks/use-checkout-step";
import { useCheckoutStore } from "../../stores/use-checkout-store";

interface DeliveryStepProps {
	cartId: string | null;
	onComplete?: (selectedOptionId: string) => void;
}

export function DeliveryStep({ cartId, onComplete }: DeliveryStepProps) {
	const { goToStep, isStepCompleted, isStepActive } = useCheckoutStep();
	const { selectedShippingOptionId, setSelectedShippingOptionId } =
		useCheckoutStore();
	const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
		selectedShippingOptionId
	);
	const [isLoading, setIsLoading] = useState(false);

	const isOpen = isStepActive("delivery");
	const isCompleted = isStepCompleted("delivery");
	const canAccess = isStepCompleted("address");

	// Get shipping options for this cart
	const { data: shippingOptions, isLoading: optionsLoading } =
		useGetShippingOptions(cartId);
	const setShippingMethod = useSetShippingMethod();

	const handleEdit = () => {
		goToStep("delivery");
	};

	const handleSubmit = async () => {
		if (!selectedOptionId || !cartId) return;

		setIsLoading(true);
		try {
			// Set shipping method on cart via Medusa API
			await setShippingMethod.mutateAsync({
				cartId,
				shippingOptionId: selectedOptionId,
			});

			// Save to store
			setSelectedShippingOptionId(selectedOptionId);

			onComplete?.(selectedOptionId);
		} catch (error) {
			console.error("Failed to set shipping method:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const selectedShipping = shippingOptions?.find(
		(o: any) => o.id === selectedOptionId
	);

	return (
		<div className="bg-white">
			{/* Header */}
			<div className="flex flex-row justify-between items-center mb-6">
				<h2
					className={cn(
						"flex flex-row font-medium gap-x-2 items-center text-3xl! tracking-wider",
						{
							"opacity-50 pointer-events-none select-none":
								!isOpen && !canAccess,
						}
					)}
				>
					Delivery
					{isCompleted && (
						<svg
							className="w-8 h-8 text-green-600"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
					)}
				</h2>

				{!isOpen && isCompleted && (
					<Button
						variant="outline"
						onClick={handleEdit}
						className="px-6 py-2 text-sm text-dark w-fit"
					>
						Edit
					</Button>
				)}
			</div>

			{/* Content */}
			{isOpen && canAccess ? (
				<div className="space-y-4">
					<p className="mb-4 text-sm text-gray-600">
						Select your preferred shipping method
					</p>

					{optionsLoading ? (
						<p className="text-sm text-gray-500">Loading shipping options...</p>
					) : (
						<div className="space-y-4">
							{shippingOptions?.map((option: any) => (
								<label
									key={option.id}
									className={cn(
										"flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all",
										selectedOptionId === option.id
											? "border-black bg-gray-50"
											: "border-gray-200 hover:border-gray-400"
									)}
								>
									<div className="flex gap-4 items-center">
										<input
											type="radio"
											name="shipping"
											value={option.id}
											checked={selectedOptionId === option.id}
											onChange={() => setSelectedOptionId(option.id)}
											className="w-6 h-6 text-black border-gray-300 focus:ring-black focus:ring-0"
										/>
										<div>
											<p className="font-medium">{option.name}</p>
											<p className="text-sm text-gray-500">Standard delivery</p>
										</div>
									</div>
									<span className="font-medium">
										{option.amount ? formatCurrency_FR(option.amount) : "Free"}
									</span>
								</label>
							))}
						</div>
					)}

					<Button
						onClick={handleSubmit}
						className="py-6 mt-6 w-full"
						disabled={!selectedOptionId || isLoading || !cartId}
					>
						{isLoading ? "Processing..." : "Continue to payment"}
					</Button>
				</div>
			) : isCompleted && selectedShipping ? (
				/* Summary when completed */
				<div className="text-sm text-gray-600">
					<p className="font-medium">{selectedShipping.name}</p>
					<p>Standard delivery</p>
					<p className="mt-1 font-medium">
						{selectedShipping.amount
							? formatCurrency_FR(selectedShipping.amount)
							: "Free"}
					</p>
				</div>
			) : !canAccess ? (
				<p className="text-sm text-gray-400">
					Complete the previous step to continue
				</p>
			) : null}

			<div className="mt-8 border-t border-gray-200" />
		</div>
	);
}

export default DeliveryStep;
