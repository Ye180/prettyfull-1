"use client";

import { LoginModal } from "@/features/auth/components/modals/login-modal";
import { sdk } from "@/lib/api/sdk";
import { Button, DropdownMenuSeparator } from "@prettyfull/ui";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
	const router = useRouter();
	const [showLoginModal, setShowLoginModal] = useState(false);

	// Vérifier si l'utilisateur est connecté avant d'aller au checkout
	const handleCheckout = async () => {
		try {
			// Vérifier si l'utilisateur est authentifié
			await sdk.store.customer.retrieve();
			// Utilisateur connecté -> aller au checkout
			router.push("/checkout");
		} catch (error) {
			// Utilisateur non connecté -> ouvrir le modal de login
			setShowLoginModal(true);
		}
	};

	// Après login réussi dans le modal, rediriger vers checkout
	const handleLoginSuccess = () => {
		router.push("/checkout");
	};

	return (
		<>
			<div>
				<h3 className="py-8 text-[3rem]! lg:text-[3.5rem]!">{t("title")}</h3>
				<div className="mb-6 space-y-8">
					<div className="space-y-8">
						<div className="flex justify-between text-md">
							<span>{t("subtotal")}</span>
							<span>{formatCurrency_FR(subtotal, currency)}</span>
						</div>

						<div className="flex justify-between text-md">
							<span>{t("shipping")}</span>
							<span>{/* {formatCurrency_FR(shipping)} */} -</span>
						</div>

						<div className="flex justify-between text-md">
							<span>{t("taxes")}</span>
							<span>{/* {formatCurrency_FR(taxes)} */}-</span>
						</div>
					</div>

					<DropdownMenuSeparator />

					<div className="flex justify-between py-6 text-lg font-semibold">
						<span>{t("total")}</span>
						<span>{formatCurrency_FR(total, currency)}</span>
					</div>
				</div>

				<DropdownMenuSeparator />

				<Button
					className="mt-8 w-full bg-black hover:bg-black/80"
					onClick={handleCheckout}
				>
					<span className="text-[1.6rem] font-semibold">Checkout</span>
				</Button>
			</div>

			{/* Modal de login */}
			<LoginModal
				open={showLoginModal}
				onOpenChange={setShowLoginModal}
				onLoginSuccess={handleLoginSuccess}
			/>
		</>
	);
};

export default CartSummary;
