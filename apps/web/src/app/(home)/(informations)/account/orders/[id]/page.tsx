"use client";

import { useGetOrderById } from "@/features/account/api/get-order-by-id";
import { sdk } from "@/lib/api/sdk";
import { useRegionStore } from "@/stores/useRegion";
import { Button, Skeleton } from "@prettyfull/ui";
import { formatCurrency_FR } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowLeftIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M19 12H5" />
		<path d="m12 19-7-7 7-7" />
	</svg>
);

const PackageIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M16.5 9.4 7.55 4.24" />
		<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
		<polyline points="3.29 7 12 12 20.71 7" />
		<line x1="12" x2="12" y1="22" y2="12" />
	</svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
		<path d="M15 18H9" />
		<path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
		<circle cx="17" cy="18" r="2" />
		<circle cx="7" cy="18" r="2" />
	</svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
		<path d="m9 11 3 3L22 4" />
	</svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
		<circle cx="12" cy="10" r="3" />
	</svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<rect width="20" height="14" x="2" y="5" rx="2" />
		<line x1="2" x2="22" y1="10" y2="10" />
	</svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<circle cx="12" cy="12" r="10" />
		<polyline points="12 6 12 12 16 14" />
	</svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		className={className}
	>
		<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
		<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
	</svg>
);

// ─── Status Mapping ───────────────────────────────────────────────────────────

type OrderStatus =
	| "pending"
	| "processing"
	| "shipped"
	| "delivered"
	| "cancelled";

const statusConfig: Record<
	OrderStatus,
	{ label: string; color: string; dot: string; step: number }
> = {
	pending: {
		label: "En attente",
		color: "bg-yellow-50 text-yellow-700 border-yellow-200",
		dot: "bg-yellow-500",
		step: 0,
	},
	processing: {
		label: "En préparation",
		color: "bg-blue-50 text-blue-700 border-blue-200",
		dot: "bg-blue-500",
		step: 1,
	},
	shipped: {
		label: "Expédié",
		color: "bg-indigo-50 text-indigo-700 border-indigo-200",
		dot: "bg-indigo-500",
		step: 2,
	},
	delivered: {
		label: "Livré",
		color: "bg-emerald-50 text-emerald-700 border-emerald-200",
		dot: "bg-emerald-500",
		step: 3,
	},
	cancelled: {
		label: "Annulé",
		color: "bg-red-50 text-red-700 border-red-200",
		dot: "bg-red-500",
		step: -1,
	},
};

const mapFulfillmentStatus = (status: string): OrderStatus => {
	switch (status) {
		case "fulfilled":
		case "delivered":
			return "delivered";
		case "shipped":
		case "partially_shipped":
			return "shipped";
		case "canceled":
			return "cancelled";
		case "not_fulfilled":
			return "processing";
		default:
			return "pending";
	}
};

const mapPaymentStatus = (status: string): string => {
	switch (status) {
		case "captured":
			return "Payé";
		case "not_paid":
			return "En attente";
		case "awaiting":
			return "En cours";
		case "refunded":
			return "Remboursé";
		case "partially_refunded":
			return "Partiellement remboursé";
		case "canceled":
			return "Annulé";
		default:
			return status || "—";
	}
};

// ─── Timeline Component ───────────────────────────────────────────────────────

const timelineSteps = [
	{ label: "Commande confirmée", icon: CheckCircleIcon },
	{ label: "En préparation", icon: PackageIcon },
	{ label: "Expédié", icon: TruckIcon },
	{ label: "Livré", icon: CheckCircleIcon },
];

const OrderTimeline = ({ currentStep }: { currentStep: number }) => {
	if (currentStep < 0) return null; // cancelled

	return (
		<div className="flex items-center w-full">
			{timelineSteps.map((step, index) => {
				const isCompleted = index <= currentStep;
				const isActive = index === currentStep;
				const Icon = step.icon;

				return (
					<div key={index} className="flex flex-1 items-center">
						<div className="flex flex-col items-center">
							<div
								className={`flex items-center justify-center rounded-full transition-all duration-300 ${
									isActive
										? "w-12 h-12 text-white bg-black ring-4 ring-black/10"
										: isCompleted
											? "w-10 h-10 text-white bg-black"
											: "w-10 h-10 text-gray-400 bg-gray-100"
								}`}
							>
								<Icon className="w-5 h-5" />
							</div>
							<span
								className={`mt-3 text-center text-[1.1rem] leading-tight max-w-20 ${
									isActive
										? "font-semibold text-black"
										: isCompleted
											? "font-medium text-gray-700"
											: "text-gray-400"
								}`}
							>
								{step.label}
							</span>
						</div>
						{index < timelineSteps.length - 1 && (
							<div
								className={`flex-1 h-0.5 mx-2 -mt-8 transition-all duration-300 ${
									index < currentStep ? "bg-black" : "bg-gray-200"
								}`}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
};

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function OrderDetailPage() {
	const params = useParams();
	const router = useRouter();
	const orderId = params.id as string;

	const [isAuthChecking, setIsAuthChecking] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [copied, setCopied] = useState(false);

	const region = useRegionStore((state: any) => state.region);
	const currency = region?.currency_code === "xof" ? "FCFA" : "$";

	useEffect(() => {
		sdk.store.customer
			.retrieve()
			.then(() => setIsAuthenticated(true))
			.catch(() => router.push("/login"))
			.finally(() => setIsAuthChecking(false));
	}, [router]);

	const { data: order, isLoading, error } = useGetOrderById(orderId);

	const handleCopyOrderId = () => {
		navigator.clipboard.writeText(orderId);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// ── Loading State ─────────────────────────────────────────────────────────

	if (isAuthChecking || isLoading) {
		return (
			<div className="space-y-8">
				<Skeleton className="w-40 h-8" />
				<Skeleton className="w-full h-16" />
				<div className="flex gap-4">
					<Skeleton className="w-1/4 h-24" />
					<Skeleton className="w-1/4 h-24" />
					<Skeleton className="w-1/4 h-24" />
					<Skeleton className="w-1/4 h-24" />
				</div>
				<Skeleton className="w-full h-32" />
				<Skeleton className="w-full h-64" />
			</div>
		);
	}

	if (!isAuthenticated) return null;

	// ── Error State ───────────────────────────────────────────────────────────

	if (error || !order) {
		return (
			<div className="space-y-6">
				<button
					onClick={() => router.back()}
					className="flex gap-2 items-center text-sm text-gray-600 transition-colors hover:text-black"
				>
					<ArrowLeftIcon className="w-4 h-4" />
					Retour
				</button>
				<div className="flex flex-col items-center p-12 text-center bg-white rounded-2xl border border-gray-200">
					<div className="flex justify-center items-center mb-4 w-16 h-16 bg-red-50 rounded-full">
						<PackageIcon className="w-8 h-8 text-red-400" />
					</div>
					<h3 className="text-[1.5rem] font-semibold text-gray-900 tracking-wide">
						Commande introuvable
					</h3>
					<p className="mx-auto mt-2 mb-6 max-w-sm text-gray-500">
						Impossible de récupérer les détails de cette commande.
					</p>
					<Link href="/account/orders">
						<Button className="px-8 text-white bg-black rounded-full hover:bg-gray-800">
							Voir mes commandes
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	// ── Data Preparation ──────────────────────────────────────────────────────

	const orderData = order as any;
	const fulfillmentStatus = mapFulfillmentStatus(
		orderData.fulfillment_status || "pending",
	);
	const status = statusConfig[fulfillmentStatus];
	const paymentLabel = mapPaymentStatus(orderData.payment_status);

	const formattedDate = new Date(orderData.created_at).toLocaleDateString(
		"fr-FR",
		{
			day: "numeric",
			month: "long",
			year: "numeric",
		},
	);

	const formattedDateTime = new Date(orderData.created_at).toLocaleDateString(
		"fr-FR",
		{
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		},
	);

	const items = orderData.items || [];
	const shippingAddress = orderData.shipping_address;
	const shippingMethods = orderData.shipping_methods || [];

	const subtotal = orderData.subtotal ?? 0;
	const shippingTotal = orderData.shipping_total ?? 0;
	const taxTotal = orderData.tax_total ?? 0;
	const discountTotal = orderData.discount_total ?? 0;
	const total = orderData.total ?? 0;

	// ── Render ────────────────────────────────────────────────────────────────

	return (
		<div className="space-y-8">
			{/* ── Back Button + Title ────────────────────────────────────────── */}
			<div className="space-y-4">
				<button
					onClick={() => router.back()}
					className="flex gap-2 items-center text-sm text-gray-500 transition-colors hover:text-black"
				>
					<ArrowLeftIcon className="w-4 h-4" />
					Retour aux commandes
				</button>

				<div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
					<div className="space-y-1">
						<div className="flex gap-3 items-center">
							<h1 className="text-3xl! font-bold tracking-tight text-gray-900">
								Commande #{orderData.display_id}
							</h1>
							<span
								className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}
							>
								<span
									className={`h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse`}
								/>
								{status.label}
							</span>
						</div>
						<div className="flex gap-2 items-center text-sm text-gray-500">
							<ClockIcon className="w-4 h-4" />
							<span>Passée le {formattedDateTime}</span>
						</div>
					</div>

					<button
						onClick={handleCopyOrderId}
						className="flex gap-2 items-center self-start px-4 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg border border-gray-200 transition-all hover:bg-gray-100"
					>
						<CopyIcon className="w-3.5 h-3.5" />
						{copied ? "Copié !" : "Copier l'ID"}
					</button>
				</div>
			</div>

			{/* ── Timeline ───────────────────────────────────────────────────── */}
			{fulfillmentStatus !== "cancelled" && (
				<div className="p-6 bg-white rounded-xl border border-gray-200 max-md:overflow-x-auto max-md:px-4">
					<OrderTimeline currentStep={status.step} />
				</div>
			)}

			{fulfillmentStatus === "cancelled" && (
				<div className="flex gap-3 items-center p-4 bg-red-50 rounded-xl border border-red-200">
					<div className="flex justify-center items-center w-10 h-10 bg-red-100 rounded-full shrink-0">
						<svg
							className="w-5 h-5 text-red-600"
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
					<div>
						<p className="font-semibold text-red-800">Commande annulée</p>
						<p className="text-sm text-red-600">
							Cette commande a été annulée.
						</p>
					</div>
				</div>
			)}

			{/* ── Info Cards Grid ────────────────────────────────────────────── */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<div className="p-4 bg-white rounded-xl border border-gray-200">
					<div className="flex gap-2 items-center mb-2">
						<PackageIcon className="w-4 h-4 text-gray-400" />
						<p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
							Commande
						</p>
					</div>
					<p className="text-[1.5rem] font-bold text-gray-900">
						#{orderData.display_id}
					</p>
				</div>

				<div className="p-4 bg-white rounded-xl border border-gray-200">
					<div className="flex gap-2 items-center mb-2">
						<ClockIcon className="w-4 h-4 text-gray-400" />
						<p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
							Date
						</p>
					</div>
					<p className="text-[1.5rem] font-bold text-gray-900">
						{formattedDate}
					</p>
				</div>

				<div className="p-4 bg-white rounded-xl border border-gray-200">
					<div className="flex gap-2 items-center mb-2">
						<CreditCardIcon className="w-4 h-4 text-gray-400" />
						<p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
							Paiement
						</p>
					</div>
					<p className="text-[1.5rem] font-bold text-gray-900">
						{paymentLabel}
					</p>
				</div>

				<div className="p-4 bg-white rounded-xl border border-gray-200">
					<div className="flex gap-2 items-center mb-2">
						<CreditCardIcon className="w-4 h-4 text-gray-400" />
						<p className="text-xs font-medium tracking-wider text-gray-500 uppercase">
							Total
						</p>
					</div>
					<p className="text-[1.5rem] font-bold text-gray-900">
						{formatCurrency_FR(total, currency)}
					</p>
				</div>
			</div>

			{/* ── Articles ───────────────────────────────────────────────────── */}
			<div className="bg-white rounded-xl border border-gray-200">
				<div className="flex justify-between items-center p-6 border-b border-gray-100">
					<h2 className="text-[2.2rem]! font-semibold text-gray-900 tracking-wide">
						Articles ({items.length})
					</h2>
				</div>

				<div className="divide-y divide-gray-100">
					{items.map((item: any) => (
						<div
							key={item.id}
							className="flex gap-4 items-center p-6 transition-colors hover:bg-gray-50/50"
						>
							{item.thumbnail && (
								<div className="overflow-hidden w-20 h-24 bg-gray-100 rounded-lg border border-gray-200 shrink-0">
									<Image
										src={item.thumbnail + "?view=1"}
										alt={item.product_title || "Produit"}
										width={80}
										height={96}
										className="object-fill object-top"
									/>
								</div>
							)}

							<div className="flex-1 min-w-0">
								<p className="font-medium text-gray-900 truncate">
									{item.product_title}
								</p>
								{item.variant_title && (
									<p className="mt-1 text-sm text-gray-500 uppercase">
										{item.variant_title}
									</p>
								)}
								<p className="mt-1 text-sm text-gray-400">
									Qté: {item.quantity}
								</p>
							</div>

							<div className="text-right shrink-0">
								<p className="font-semibold tracking-wide text-gray-900">
									{formatCurrency_FR(item.unit_price * item.quantity, currency)}
								</p>
								{item.quantity > 1 && (
									<p className="text-xs text-gray-400">
										{formatCurrency_FR(item.unit_price, currency)} / unité
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* ── Two-Column: Address + Summary ──────────────────────────────── */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Shipping Address */}
				<div className="bg-white rounded-xl border border-gray-200">
					<div className="flex gap-2 items-center p-6 border-b border-gray-100">
						<MapPinIcon className="w-8 h-8 text-gray-400" />
						<h2 className="text-[2.2rem]! font-semibold  text-gray-900 tracking-wide">
							Adresse de livraison
						</h2>
					</div>
					<div className="p-6">
						{shippingAddress ? (
							<div className="space-y-1 text-sm text-gray-600">
								<p className="text-base font-medium text-gray-900">
									{shippingAddress.first_name} {shippingAddress.last_name}
								</p>
								<p>{shippingAddress.address_1}</p>
								{shippingAddress.address_2 && (
									<p>{shippingAddress.address_2}</p>
								)}
								<p>
									{shippingAddress.postal_code} {shippingAddress.city}
								</p>
								<p>{shippingAddress.country_code?.toUpperCase()}</p>
								{shippingAddress.phone && (
									<p className="pt-2 text-gray-500">
										Tél: {shippingAddress.phone}
									</p>
								)}
							</div>
						) : (
							<p className="text-sm text-gray-400">Aucune adresse renseignée</p>
						)}
					</div>
				</div>

				{/* Order Summary */}
				<div className="bg-white rounded-xl border border-gray-200">
					<div className="flex gap-2 items-center p-6 border-b border-gray-100">
						<CreditCardIcon className="w-8 h-8 text-gray-400" />
						<h2 className="text-[2.2rem]!  font-semibold text-gray-900 tracking-wide">
							Récapitulatif
						</h2>
					</div>
					<div className="p-6 space-y-4">
						<div className="flex justify-between text-sm text-gray-600">
							<span>Sous-total</span>
							<span>{formatCurrency_FR(subtotal, currency)}</span>
						</div>

						{shippingMethods.length > 0 && (
							<div className="flex justify-between text-sm text-gray-600">
								<span className="flex items-center gap-1.5">
									<TruckIcon className="w-6 h-6" />
									Livraison
								</span>
								<span>
									{shippingTotal === 0
										? "Gratuite"
										: formatCurrency_FR(shippingTotal, currency)}
								</span>
							</div>
						)}

						{!shippingMethods.length && (
							<div className="flex justify-between text-sm text-gray-600">
								<span>Livraison</span>
								<span>
									{shippingTotal === 0
										? "Gratuite"
										: formatCurrency_FR(shippingTotal, currency)}
								</span>
							</div>
						)}

						<div className="flex justify-between text-sm text-gray-600">
							<span>Taxes</span>
							<span>{formatCurrency_FR(taxTotal, currency)}</span>
						</div>

						{discountTotal > 0 && (
							<div className="flex justify-between text-sm text-green-600">
								<span>Réduction</span>
								<span>-{formatCurrency_FR(discountTotal, currency)}</span>
							</div>
						)}

						<div className="flex justify-between pt-4 text-[2.2rem]! font-bold text-gray-900 border-t border-gray-200">
							<span>Total</span>
							<span>{formatCurrency_FR(total, currency)}</span>
						</div>
					</div>
				</div>
			</div>

			{/* ── Shipping Method ─────────────────────────────────────────────── */}
			{shippingMethods.length > 0 && (
				<div className="bg-white rounded-xl border border-gray-200">
					<div className="flex gap-2 items-center p-6 border-b border-gray-100">
						<TruckIcon className="w-8 h-8 text-gray-400" />
						<h2 className="text-[2.2rem]!  font-semibold text-gray-900 tracking-wide">
							Méthode de livraison
						</h2>
					</div>
					<div className="p-6">
						{shippingMethods.map((method: any, index: number) => (
							<div key={index} className="flex justify-between items-center">
								<div>
									<p className="font-medium text-gray-900">
										{method.name || method.shipping_option?.name || "Standard"}
									</p>
								</div>
								<p className="font-medium text-gray-900">
									{method.amount === 0
										? "Gratuit"
										: formatCurrency_FR(method.amount ?? 0, currency)}
								</p>
							</div>
						))}
					</div>
				</div>
			)}

			{/* ── Actions ────────────────────────────────────────────────────── */}
			<div className="flex flex-col gap-4 sm:flex-row">
				<Link href="/account/orders" className="flex-1">
					<Button
						variant="outline"
						className="w-full rounded-full border-gray-300 hover:bg-black"
					>
						Voir toutes mes commandes
					</Button>
				</Link>
				<Link href="/" className="flex-1">
					<Button className="w-full text-white bg-black rounded-full hover:bg-gray-800">
						Continuer mes achats
					</Button>
				</Link>
			</div>
		</div>
	);
}
