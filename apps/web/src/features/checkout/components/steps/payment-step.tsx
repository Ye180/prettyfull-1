"use client";

import { Button } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useGetPaymentProviders } from "../../api/get-payment-providers";
import { useInitPaymentSession } from "../../api/init-payment-session";
import { useCheckoutStep } from "../../hooks/use-checkout-step";
import { useCheckoutStore } from "../../stores/use-checkout-store";

interface PaymentMethod {
	id: string;
	name: string;
	icon?: string;
}

interface PaymentStepProps {
	cartId: string | null;
	regionId: string | null;
	onComplete?: (paymentMethod: string) => void;
}

export function PaymentStep({
	cartId,
	regionId,
	onComplete,
}: PaymentStepProps) {
	const t = useTranslations("CheckoutPage.payment");
	const { goToStep, isStepCompleted, isStepActive } = useCheckoutStep();
	const { selectedPaymentProviderId, setSelectedPaymentProviderId } =
		useCheckoutStore();
	const [selectedMethod, setSelectedMethod] = useState<string | null>(
		selectedPaymentProviderId,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Get payment providers for this region
	const { data: paymentProviders, isLoading: providersLoading } =
		useGetPaymentProviders();
	const initPaymentSession = useInitPaymentSession();

	const isOpen = isStepActive("payment");
	const isCompleted = isStepCompleted("payment");
	const canAccess = isStepCompleted("delivery");

	const handleEdit = () => {
		goToStep("payment");
	};

	const handleSubmit = async () => {
		if (!selectedMethod || !cartId) return;

		setIsLoading(true);
		setError(null);
		try {
			// Initialize payment session via Medusa API
			await initPaymentSession.mutateAsync({
				cartId,
				providerId: selectedMethod,
			});

			// Save to store
			setSelectedPaymentProviderId(selectedMethod);

			onComplete?.(selectedMethod);
		} catch (error: any) {
			console.error("Failed to initialize payment session:", error);
			const errorMessage = error?.message || t("initError");

			// Check if it's the payment collection error
			if (errorMessage.includes("No payment collection")) {
				setError(t("paymentCollectionError"));
			} else {
				setError(errorMessage);
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Helper to get friendly provider name
	/**
	 * Libellé du moyen de paiement.
	 *
	 * L'API porte déjà le nom d'affichage de chaque agrégateur, défini dans son
	 * adaptateur : un nouveau prestataire s'affiche donc correctement sans
	 * toucher à ce fichier. La table locale n'est qu'un repli.
	 */
	const getProviderName = (provider: { id: string; name?: string }): string => {
		if (provider.name) return provider.name;

		const fallback: Record<string, string> = {
			manual: t("codLabel"),
			wave: "Wave",
		};
		return fallback[provider.id] || provider.id;
	};

	// La carte se saisit sur la page hébergée de Stripe, jamais ici : aucune
	// donnée bancaire ne transite par le site.
	const isStripeProvider = selectedMethod === "stripe";
	const isSystemProvider =
		selectedMethod?.includes("system") || selectedMethod?.includes("manual");

	const canSubmit = selectedMethod !== null;

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
						},
					)}
				>
					{t("title")}
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
						{t("edit")}
					</Button>
				)}
			</div>

			{/* Content */}
			{isOpen && canAccess ? (
				<div className="space-y-6">
					<p className="text-sm text-gray-600">{t("selectMethod")}</p>

					{/* Error Message */}
					{error && (
						<div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg">
							{error}
						</div>
					)}

					{/* Payment Methods */}
					{providersLoading ? (
						<p className="text-sm text-gray-500">{t("loadingMethods")}</p>
					) : (
						<div className="space-y-8">
							{paymentProviders?.map((provider: any) => (
								<label
									key={provider.id}
									className={cn(
										"flex items-center gap-4 px-4 py-8 border rounded-lg cursor-pointer transition-all",
										selectedMethod === provider.id
											? "border-black bg-gray-50"
											: "border-gray-200 hover:border-gray-400",
									)}
								>
									<input
										type="radio"
										name="payment"
										value={provider.id}
										checked={selectedMethod === provider.id}
										onChange={() => setSelectedMethod(provider.id)}
										className="w-4 h-4 text-black border-gray-300 focus:ring-black"
									/>
									<span className="font-medium">
										{getProviderName(provider)}
									</span>
								</label>
							))}
						</div>
					)}

					{/* COD Info - Show for System/Manual provider */}
					{isSystemProvider && (
						<div className="p-4 space-y-2 text-sm bg-green-50 rounded-lg border border-green-200">
							<p className="font-medium text-green-800">
								{t("codLabel")}
							</p>
							<p className="text-green-700">
								{t("codDescription")}
							</p>
						</div>
					)}

					{/* Stripe - redirection vers la page de paiement hébergée */}
					{isStripeProvider && (
						<div className="p-4 space-y-2 text-sm bg-gray-50 rounded-lg border border-gray-200">
							<p className="font-medium text-gray-900">
								{t("stripeLabel")}
							</p>
							<p className="text-gray-600">{t("stripeDescription")}</p>
						</div>
					)}

					<Button
						onClick={handleSubmit}
						className="py-6 w-full"
						disabled={!canSubmit || isLoading || !cartId}
					>
						{isLoading ? t("processing") : t("reviewOrder")}
					</Button>
				</div>
			) : isCompleted ? (
				/* Summary when completed */
				<div className="text-sm text-gray-600">
					<p>
						{t("paymentMethodLabel")}{" "}
						{selectedMethod
							? getProviderName(
									paymentProviders?.find((p: any) => p.id === selectedMethod) ?? {
										id: selectedMethod,
									},
								)
							: ""}
					</p>
				</div>
			) : !canAccess ? (
				<p className="text-sm text-gray-400">
					{t("completePreviousStep")}
				</p>
			) : null}

			<div className="mt-8 border-t border-gray-200" />
		</div>
	);
}

export default PaymentStep;
