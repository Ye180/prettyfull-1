"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { fetchOrderConfirmation } from "@/lib/store-api";
import { Skeleton } from "@prettyfull/ui";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const OrderConfirmationView = () => {
	const searchParams = useSearchParams();
	const orderId = searchParams.get("order_id");
	const token = searchParams.get("token");

	const {
		data: order,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["order-confirmation", orderId, token],
		queryFn: () => fetchOrderConfirmation(orderId as string, token as string),
		enabled: Boolean(orderId && token),
		retry: false,
	});

	const [isPaymentDetailOpen, setIsPaymentDetailOpen] = useState(false);

	if (!orderId || !token || error) {
		return (
			<main className="w-full min-h-screen bg-white text-gray-900 pb-28 pt-14 flex items-center justify-center">
				<div className="text-center max-w-md px-4 flex flex-col items-center">
					<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gray-400">
							<circle cx="12" cy="12" r="9" />
							<path d="M12 8v4" />
							<path d="M12 16h.01" />
						</svg>
					</div>
					<span className="text-xs uppercase tracking-widest font-semibold text-gray-400">
						Confirmation introuvable
					</span>
					<h1 className="mt-3 text-2xl font-bold text-gray-900">
						Ce lien de confirmation n&apos;est plus valide
					</h1>
					<p className="mt-2 text-gray-500">
						Ce lien de confirmation est invalide ou a expiré. Retrouvez vos
						commandes depuis votre compte.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
						<Link
							href="/account/orders"
							className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-black/85 transition"
						>
							My Orders
						</Link>
						<Link
							href="/"
							className="px-6 py-3 bg-white border border-gray-300 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition"
						>
							Back to Home
						</Link>
					</div>
				</div>
			</main>
		);
	}

	if (isLoading || !order) {
		return (
			<main className="w-full min-h-screen bg-white pb-28 pt-14">
				<div className="max-w-[860px] mx-auto px-4 sm:px-6 space-y-6">
					<Skeleton className="h-24 w-full rounded-2xl" />
					<Skeleton className="h-96 w-full rounded-3xl" />
				</div>
			</main>
		);
	}

	const currency = order.currency_code.toUpperCase();

	return (
		<main className="w-full min-h-screen bg-white text-gray-900 pb-28 pt-8 sm:pt-14">
			<div className="max-w-[860px] mx-auto px-4 sm:px-6">
				{/* Thank You Header */}
				<div className="text-center space-y-3 pb-8 sm:pb-10">
					<div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
						<svg
							className="w-8 h-8 sm:w-10 sm:h-10"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>

					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-gray-950">
						Thank You!
					</h1>
					<p className="text-xl sm:text-2xl font-semibold text-gray-800 font-sans">
						Your Order Has Been Received.
					</p>
					<p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
						The order confirmation has been sent to{" "}
						<span className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-4">
							{order.email}
						</span>
					</p>
					<p className="text-xs uppercase tracking-widest text-gray-400 font-semibold pt-1">
						Order ID: #{order.display_id}
					</p>
				</div>

				{/* Order Items Card */}
				<div className="bg-[#F9FAFB] rounded-3xl p-6 sm:p-8 border border-gray-150/80 shadow-xs mb-8 space-y-6">
					<div className="divide-y divide-gray-200/80">
						{order.items.map((item) => (
							<div
								key={item.id}
								className="py-5 first:pt-0 last:pb-0 flex items-center gap-4 sm:gap-6"
							>
								<div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl overflow-hidden shrink-0 border border-gray-200">
									{item.thumbnail && (
										<Image
											src={item.thumbnail}
											alt={item.product_title}
											fill
											sizes="96px"
											className="object-contain p-2"
											unoptimized
										/>
									)}
								</div>

								<div className="flex-1 min-w-0">
									<h3 className="text-base sm:text-lg font-bold text-gray-950 font-sans tracking-tight truncate">
										{item.product_title}
									</h3>
									<div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mt-1.5">
										<span>{item.variant_title}</span>
										<span className="text-gray-300">|</span>
										<div>
											<span>Quantity:</span>{" "}
											<span className="font-bold text-gray-800">{item.quantity}</span>
										</div>
									</div>
								</div>

								<p className="text-base sm:text-lg font-extrabold text-gray-950 whitespace-nowrap">
									{formatCurrency_FR(item.unit_price * item.quantity, currency)}
								</p>
							</div>
						))}
					</div>

					{/* Payment Method Detail Accordion */}
					<div className="pt-4 border-t border-gray-200/80">
						<button
							type="button"
							onClick={() => setIsPaymentDetailOpen(!isPaymentDetailOpen)}
							className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-900 cursor-pointer group"
						>
							<span>Payment Method Detail</span>
							<span
								className={`transform transition-transform text-gray-400 group-hover:text-gray-900 ${
									isPaymentDetailOpen ? "rotate-180" : ""
								}`}
							>
								▾
							</span>
						</button>

						{isPaymentDetailOpen && (
							<div className="p-4 mt-3 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-600 space-y-1">
								<p>
									<span className="font-medium text-gray-900">Status:</span>{" "}
									{order.status === "canceled" ? "Cancelled" : "Confirmed"}
								</p>
								<p>
									<span className="font-medium text-gray-900">Receipt:</span> Sent via
									email to {order.email}
								</p>
							</div>
						)}
					</div>

					{/* Cost Breakdown */}
					<div className="pt-4 border-t border-gray-200/80 space-y-3 text-sm">
						<div className="flex justify-between items-center text-gray-600">
							<span>Subtotal</span>
							<span className="font-semibold text-gray-900">
								{formatCurrency_FR(order.subtotal, currency)}
							</span>
						</div>
						<div className="flex justify-between items-center text-gray-600">
							<span>Shipping</span>
							<span className="font-semibold text-gray-900">
								{order.shipping_total === 0
									? "Free"
									: formatCurrency_FR(order.shipping_total, currency)}
							</span>
						</div>
						<div className="flex justify-between items-center text-gray-600">
							<span>Tax</span>
							<span className="font-semibold text-gray-900">
								{formatCurrency_FR(order.tax_total, currency)}
							</span>
						</div>

						<div className="w-full h-px bg-gray-200/80 my-2" />

						<div className="flex justify-between items-center pt-1">
							<span className="text-base font-bold text-gray-900">Total</span>
							<span className="text-2xl sm:text-3xl font-extrabold text-gray-950 font-sans tracking-tight">
								{formatCurrency_FR(order.total, currency)}
							</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center items-center pt-2">
					<Link
						href="/account/orders"
						className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-black/85 text-white font-semibold rounded-full transition shadow-sm cursor-pointer text-sm sm:text-base text-center"
					>
						Track Your Order
					</Link>

					<Link
						href="/"
						className="w-full sm:w-auto px-8 py-3.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold rounded-full transition shadow-xs text-sm sm:text-base text-center"
					>
						Back to Home Page
					</Link>

					<Link
						href="/collections"
						className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-black/85 text-white font-semibold rounded-full transition shadow-sm text-sm sm:text-base text-center flex items-center justify-center gap-2"
					>
						<span>Continue Shopping</span>
						<ArrowRightIcon className="w-4 h-4" />
					</Link>
				</div>
			</div>
		</main>
	);
};

export default OrderConfirmationView;
