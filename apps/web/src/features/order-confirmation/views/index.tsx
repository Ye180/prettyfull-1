"use client";

import { getOrderById } from "@/lib/fake-data";
import { useRegionStore } from "@/stores/useRegion";
import { formatCurrency_FR } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const OrderConfirmationView = () => {
	const searchParams = useSearchParams();
	const orderId = searchParams.get("order_id");
	const region = useRegionStore((state) => state.region);
	const currency = region?.currency_code === "xof" ? "FCFA" : "$";

	const order = orderId ? getOrderById(orderId) : undefined;
	const error = !orderId
		? "Aucun identifiant de commande trouvé."
		: !order
			? "Unable to retrieve order details. Please check your account."
			: null;

	if (error || !order) {
		return (
			<Container maxWidth="100vw" className="px-4 py-20 text-center">
				<div className="flex flex-col items-center space-y-6">
					<div className="flex justify-center items-center w-20 h-20 bg-red-100 rounded-full">
						<svg
							className="w-10 h-10 text-red-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</div>
					<h1 className="text-3xl font-semibold text-gray-900">
						{error || "Commande introuvable"}
					</h1>
					<Link
						href="/"
						className="px-8 py-3 text-white bg-black rounded-md hover:bg-gray-800"
					>
						Retour à l&apos;accueil
					</Link>
				</div>
			</Container>
		);
	}

	const formattedDate = new Date(order.created_at).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<Container maxWidth="100vw" className="px-4 py-12 pb-20 lg:px-80">
			<div className="mx-auto space-y-10 max-w-3xl">
				{/* Success Header */}
				<div className="flex flex-col items-center space-y-4 text-center">
					<div className="flex justify-center items-center w-20 h-20 bg-green-100 rounded-full">
						<svg
							className="w-10 h-10 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h1 className="text-4xl font-semibold text-gray-900">
						Merci pour votre commande !
					</h1>
					<p className="text-gray-500">
						Votre commande a été confirmée et sera traitée sous peu.
					</p>
					<p className="text-sm text-gray-400">
						Un email de confirmation a été envoyé à{" "}
						<span className="font-medium text-gray-600">{order.email}</span>
					</p>
				</div>

				{/* Order Info */}
				<div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
					<div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
						<div>
							<p className="text-xs text-gray-500 uppercase">Commande</p>
							<p className="mt-1 font-medium text-gray-900">
								#{order.display_id}
							</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 uppercase">Date</p>
							<p className="mt-1 font-medium text-gray-900">{formattedDate}</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 uppercase">Paiement</p>
							<p className="mt-1 font-medium text-gray-900">
								{order.status === "canceled" ? "Annulé" : "Payé"}
							</p>
						</div>
						<div>
							<p className="text-xs text-gray-500 uppercase">Total</p>
							<p className="mt-1 font-medium text-gray-900">
								{formatCurrency_FR(order.total, currency)}
							</p>
						</div>
					</div>
				</div>

				{/* Shipping Address */}
				{order.shipping_address && (
					<div className="space-y-3">
						<h2 className="text-lg font-semibold text-gray-900">
							Adresse de livraison
						</h2>
						<div className="p-4 text-sm text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
							<p className="font-medium text-gray-900">
								{order.shipping_address.first_name}{" "}
								{order.shipping_address.last_name}
							</p>
							<p>{order.shipping_address.address_1}</p>
							{order.shipping_address.address_2 && (
								<p>{order.shipping_address.address_2}</p>
							)}
							<p>
								{order.shipping_address.postal_code}{" "}
								{order.shipping_address.city}
							</p>
							<p>{order.shipping_address.country_code?.toUpperCase()}</p>
							{order.shipping_address.phone && (
								<p className="mt-1">Tel: {order.shipping_address.phone}</p>
							)}
						</div>
					</div>
				)}

				{/* Order Items */}
				<div className="space-y-3">
					<h2 className="text-lg font-semibold text-gray-900">
						Articles commandés ({order.items?.length || 0})
					</h2>
					<div className="rounded-lg border border-gray-200 divide-y divide-gray-200">
						{order.items?.map((item: any) => (
							<div key={item.id} className="flex gap-4 items-center p-4">
								{item.thumbnail && (
									<div className="overflow-hidden w-16 h-24 rounded-lg border border-gray-200 shrink-0">
										<Image
											src={item.thumbnail}
											alt={item.product_title || "Product"}
											width={64}
											height={96}
											className="object-cover w-full h-full"
											unoptimized
										/>
									</div>
								)}
								<div className="flex-1 min-w-0">
									<p className="font-medium text-gray-900 truncate">
										{item.product_title}
									</p>
									<p className="text-sm text-gray-500">
										{item.variant_title} &times; {item.quantity}
									</p>
								</div>
								<p className="font-medium text-gray-900 whitespace-nowrap">
									{formatCurrency_FR(item.unit_price * item.quantity, currency)}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Totals */}
				<div className="p-6 space-y-3 bg-gray-50 rounded-lg border border-gray-200">
					<div className="flex justify-between text-sm text-gray-600">
						<span>Subtotal</span>
						<span>{formatCurrency_FR(order.subtotal, currency)}</span>
					</div>
					<div className="flex justify-between text-sm text-gray-600">
						<span>Livraison</span>
						<span>{formatCurrency_FR(order.shipping_total, currency)}</span>
					</div>
					<div className="flex justify-between text-sm text-gray-600">
						<span>Taxes</span>
						<span>{formatCurrency_FR(order.tax_total, currency)}</span>
					</div>
					<div className="flex justify-between pt-3 text-lg font-semibold text-gray-900 border-t border-gray-300">
						<span>Total</span>
						<span>{formatCurrency_FR(order.total, currency)}</span>
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
					<Link
						href="/"
						className="px-8 py-3 w-full text-center text-white bg-black rounded-md sm:w-auto hover:bg-gray-800"
					>
						Continue shopping
					</Link>
					<Link
						href="/account/orders"
						className="px-8 py-3 w-full text-center text-black rounded-md border border-black sm:w-auto hover:bg-gray-50"
					>
						Voir my Orders
					</Link>
				</div>
			</div>
		</Container>
	);
};

export default OrderConfirmationView;
