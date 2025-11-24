"use client";

import { useAuth } from "@/hooks/useAuth"; // 1. Importer votre hook d'authentification
import { Button, DropdownMenuSeparator } from "@prettyfull/ui";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

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
	currency = "USD",
}: CartSummaryProps) => {
	const t = useTranslations("CheckoutPage.summary");

	const router = useRouter(); // 2. Initialiser le router
	const { isAuthenticated, isLoading } = useAuth(); // 3. Obtenir l'état de l'utilisateur depuis votre hook

	// 4. Logique de redirection
	const handleCheckout = () => {
		if (isLoading) {
			return; // Attendre que la vérification d'auth soit terminée
		}

		if (isAuthenticated) {
			// 5. Si connecté, aller au checkout
			router.push("/checkout");
		} else {
			// 6. Si invité, aller au login en mémorisant la page de destination
			router.push("/login?callbackUrl=/checkout");
		}
	};

	return (
		<>
			<div>
				<h3 className="py-8 text-[3rem]! lg:text-[3.5rem]!">{t("title")}</h3>
				<div className="mb-6 space-y-8">
					<div className="space-y-8">
						<div className="flex justify-between text-md">
							<span>{t("subtotal")}</span>
							<span>{formatCurrency_FR(subtotal)}</span>
						</div>

						<div className="flex justify-between text-md">
							<span>{t("shipping")}</span>
							<span>{formatCurrency_FR(shipping)}</span>
						</div>

						<div className="flex justify-between text-md">
							<span>{t("taxes")}</span>
							<span>{formatCurrency_FR(taxes)}</span>
						</div>
					</div>

					<DropdownMenuSeparator />

					<div className="flex justify-between py-6 text-lg font-semibold">
						<span>{t("total")}</span>
						<span>{formatCurrency_FR(total)}</span>
					</div>
				</div>

				<DropdownMenuSeparator />

				<Button
					className="w-full mt-8 bg-black hover:bg-black/80"
					onClick={handleCheckout}
				>
					<span className="text-[1.6rem] font-semibold">Checkout</span>
				</Button>
			</div>
		</>
	);
};

export default CartSummary;
