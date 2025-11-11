'use client';

import { Button } from '@prettyfull/ui';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth'; // 1. Importer votre hook d'authentification

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
	const router = useRouter(); // 2. Initialiser le router
	const { isAuthenticated, isLoading } = useAuth(); // 3. Obtenir l'état de l'utilisateur depuis votre hook

	// 4. Logique de redirection
	const handleCheckout = () => {
		if (isLoading) {
			return; // Attendre que la vérification d'auth soit terminée
		}

		if (isAuthenticated) {
			// 5. Si connecté, aller au checkout
			router.push('/checkout');
		} else {
			// 6. Si invité, aller au login en mémorisant la page de destination
			router.push('/login?callbackUrl=/checkout');
		}
	};

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

			{/* 7. Bouton mis à jour avec onClick et état de chargement */}
			<Button
				className="w-full mt-6 py-3 rounded-full text-base font-medium bg-black hover:bg-gray-700 transition"
				onClick={handleCheckout}
				isLoading={isLoading}
				disabled={isLoading}
			>
				Checkout
			</Button>
		</div>
	);
};

export default CartSummary;