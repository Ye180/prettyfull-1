"use client";

import { Button } from "@prettyfull/ui";
import { cn, formatCurrency_FR } from "@prettyfull/utils";
import { useState } from "react";
import { useGetShippingMedusa } from "../../api/get-shipping-medusa";
import { useCheckoutStep } from "../../hooks/use-checkout-step";

interface DeliveryStepProps {
	onComplete?: (selectedOptionId: string) => void;
}

export function DeliveryStep({ onComplete }: DeliveryStepProps) {
	const { goToStep, isStepCompleted, isStepActive } = useCheckoutStep();
	const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const isOpen = isStepActive("delivery");
	const isCompleted = isStepCompleted("delivery");
	const canAccess = isStepCompleted("address");

	const { data: shipping } = useGetShippingMedusa();

	const handleEdit = () => {
		goToStep("delivery");
	};

	const handleSubmit = async () => {
		if (!selectedOptionId) return;

		const option = shipping?.find((o) => o.id === selectedOptionId);
		if (option) {
			setIsLoading(true);
			// TODO: Call API to set shipping option on cart
			await new Promise((resolve) => setTimeout(resolve, 500));
			onComplete?.(option.id);
			setIsLoading(false);
		}
	};

	const selectedShipping = shipping?.find((o) => o.id === selectedOptionId);

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

					<div className="space-y-4">
						{shipping?.map((option) => (
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
										<p className="text-sm text-gray-500">
											{option.type?.label || "Standard delivery"}
										</p>
									</div>
								</div>
								<span className="font-medium">
									{formatCurrency_FR(
										(option.prices?.[1]?.amount ?? 0) as number
									)}
								</span>
							</label>
						))}
					</div>

					<Button
						onClick={handleSubmit}
						className="py-6 mt-6 w-full"
						disabled={!selectedOptionId || isLoading}
					>
						{isLoading ? "Processing..." : "Continue to payment"}
					</Button>
				</div>
			) : isCompleted && selectedShipping ? (
				/* Summary when completed */
				<div className="text-sm text-gray-600">
					<p className="font-medium">{selectedShipping.name}</p>
					<p>{selectedShipping.type?.label || "Standard delivery"}</p>
					<p className="mt-1 font-medium">
						{formatCurrency_FR(
							(selectedShipping.prices?.[0]?.amount ?? 0) as number
						)}
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
