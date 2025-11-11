import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
	{
		id: 1,
		name: "Informations du produit",
		description: "Détails généraux et prix",
	},
	{
		id: 2,
		name: "Variantes",
		description: "Couleurs, tailles et stock",
	},
];

export default function ProductStepper({ currentStep, isStep1Completed }) {
	return (
		<nav aria-label="Progress" className="mb-8">
			<ol className="flex items-center justify-center space-x-8">
				{steps.map((step, stepIdx) => {
					const stepNumber = stepIdx;
					const isActive = currentStep === stepNumber;
					const isCompleted =
						stepNumber < currentStep || (stepNumber === 0 && isStep1Completed);

					return (
						<li key={step.name} className="flex items-center">
							<div className="relative flex flex-col items-center">
								{/* Step Circle */}
								<div
									className={cn(
										"flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200",
										isCompleted
											? "bg-green-600 border-green-600"
											: isActive
												? "bg-blue-600 border-blue-600"
												: "bg-gray-200 border-gray-300"
									)}
								>
									{isCompleted ? (
										<Check className="w-6 h-6 text-white" />
									) : (
										<span
											className={cn(
												"text-lg font-semibold",
												isActive ? "text-white" : "text-gray-600"
											)}
										>
											{step.id}
										</span>
									)}
								</div>

								{/* Step Info */}
								<div className="mt-3 text-center">
									<div
										className={cn(
											"text-sm font-medium",
											isActive
												? "text-blue-600"
												: isCompleted
													? "text-green-600"
													: "text-gray-500"
										)}
									>
										{step.name}
									</div>
									<div className="text-xs text-gray-500 mt-1">
										{step.description}
									</div>
								</div>
							</div>

							{/* Connector Line */}
							{stepIdx < steps.length - 1 && (
								<div
									className={cn(
										"h-0.5 w-24 ml-4 transition-all duration-200",
										isCompleted ? "bg-green-600" : "bg-gray-300"
									)}
									style={{ marginBottom: "3rem" }}
								/>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
