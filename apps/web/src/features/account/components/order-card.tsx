"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { formatCurrency_FR } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";

const CalendarIcon = ({ className }: { className?: string }) => (
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
		<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
		<line x1="16" x2="16" y1="2" y2="6" />
		<line x1="8" x2="8" y1="2" y2="6" />
		<line x1="3" x2="21" y1="10" y2="10" />
	</svg>
);

interface OrderCardProps {
	order: {
		id: string;
		displayId: string;
		createdAt: string | Date;
		status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
		total: number;
		currency: string;
		items: Array<{
			id: string;
			thumbnail: string;
			title: string;
			quantity: number;
		}>;
	};
}

const statusStyles = {
	pending: {
		label: "En attente",
		color: "bg-yellow-50 text-yellow-700 border-yellow-200",
		dot: "bg-yellow-500",
	},
	processing: {
		label: "En préparation",
		color: "bg-blue-50 text-blue-700 border-blue-200",
		dot: "bg-blue-500",
	},
	shipped: {
		label: "Expédié",
		color: "bg-indigo-50 text-indigo-700 border-indigo-200",
		dot: "bg-indigo-500",
	},
	delivered: {
		label: "Livré",
		color: "bg-emerald-50 text-emerald-700 border-emerald-200",
		dot: "bg-emerald-500",
	},
	cancelled: {
		label: "Annulé",
		color: "bg-red-50 text-red-700 border-red-200",
		dot: "bg-red-500",
	},
};

export const OrderCard = ({ order }: OrderCardProps) => {
	const status = statusStyles[order.status] || statusStyles.pending;

	const date = new Date(order.createdAt).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<div className="w-[83%]  rounded-2xl border border-gray-100 transition-all duration-200 group">
			<div className="flex flex-col gap-4 justify-between p-6 border-b border-gray-100/80 sm:flex-row sm:items-start">
				<div className="space-y-3">
					<div className="flex gap-3 items-center">
						<p className="font-semibold text-gray-900 text-md!">
							Commande{" "}
							<span className="text-md! text-gray-500">#{order.displayId}</span>
						</p>

						<span
							className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}
						>
							<span
								className={`h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse`}
							/>
							{status.label}
						</span>
					</div>

					<div className="flex items-center text-sm font-medium text-gray-500">
						<CalendarIcon className="mr-2 w-4 h-4 text-gray-400" />
						{date}
					</div>
				</div>

				<div className="text-left sm:text-right">
					<p className="text-xl font-bold tracking-tight text-gray-900">
						{formatCurrency_FR(order.total, order.currency)}
					</p>
					<p className="mt-1 text-sm font-medium text-gray-500">
						{order.items.length} article{order.items.length > 1 ? "s" : ""}
					</p>
				</div>
			</div>

			<div className="p-6 bg-gray-50/30">
				<div className="flex gap-x-10 items-center pb-2 h-60 horizontal-scroll scrollbar-hide">
					{order.items.map((item) => (
						<div key={item.id} className="flex space-x-8 sm:space-x-10">
							<div className="relative w-40 h-44 bg-gray-100 rounded-2xl aspect-square">
								<div className="overflow-hidden w-40 h-44 rounded-2xl border border-gray-200">
									<Image
										src={item.thumbnail}
										alt={item.title}
										width={100}
										height={100}
										className="object-top rounded-2xl"
										unoptimized
									/>
								</div>
								{item.quantity > 1 && (
									<p className="absolute flex items-center justify-center font-semibold text-white bg-black rounded-full -top-4 -right-5 size-12 text-[1.4rem]">
										{item.quantity}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="flex justify-between items-start p-5 px-6 border-t border-gray-100 md:items-center max-md:flex-col max-md:gap-y-10">
				<Link
					href={`/account/orders/${order.id}`}
					className="flex items-center text-sm font-semibold text-gray-600 transition-colors group/link hover:text-black"
				>
					Order details
					<ArrowRightIcon className="ml-2 w-4 h-4 opacity-0 transition-all duration-200 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0" />
				</Link>

				{/* <Button className="py-4 text-white bg-black rounded-full w-fit">
					Suivre le colis
				</Button> */}
			</div>
		</div>
	);
};
