"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { useDisplayCurrency } from "@/hooks/use-display-currency";
import type { CurrencyCode } from "@prettyfull/contracts";
import { useTranslations } from "next-intl";
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
		color: "bg-yellow-50 text-yellow-700 border-yellow-200",
		dot: "bg-yellow-500",
	},
	processing: {
		color: "bg-stone-100 text-black border-blue-200",
		dot: "bg-blue-500",
	},
	shipped: {
		color: "bg-indigo-50 text-indigo-700 border-indigo-200",
		dot: "bg-indigo-500",
	},
	delivered: {
		color: "bg-emerald-50 text-emerald-700 border-emerald-200",
		dot: "bg-emerald-500",
	},
	cancelled: {
		color: "bg-red-50 text-red-700 border-red-200",
		dot: "bg-red-500",
	},
};

export const OrderCard = ({ order }: OrderCardProps) => {
	const t = useTranslations("Account");
	const { format } = useDisplayCurrency();
	const statusKey = statusStyles[order.status] ? order.status : "pending";
	const status = statusStyles[statusKey];
	const statusLabel = t(`orders.status.${statusKey}`);

	const date = new Date(order.createdAt).toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<div className="border transition-colors group border-(--color-surface-border) hover:border-(--color-ink)/40">
			<div className="flex flex-col gap-4 justify-between p-6 border-b sm:flex-row sm:items-start border-(--color-surface-border)">
				<div className="space-y-3">
					<div className="flex gap-3 items-center">
						<p className="text-[1.6rem] font-medium text-(--color-ink)">
							{t("orderCard.orderLabel")}{" "}
							<span className="text-(--color-surface-muted)">#{order.displayId}</span>
						</p>

						<span
							className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[1.2rem] font-medium ${status.color}`}
						>
							<span
								className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
							/>
							{statusLabel}
						</span>
					</div>

					<div className="flex items-center text-[1.35rem] text-(--color-surface-muted)">
						<CalendarIcon className="mr-2 w-4 h-4" />
						{date}
					</div>
				</div>

				<div className="text-left sm:text-right">
					<p className="text-[1.8rem] font-semibold text-(--color-ink)">
						{format(order.total, order.currency as CurrencyCode)}
					</p>
					<p className="mt-1 text-[1.3rem] text-(--color-surface-muted)">
						{t("orderCard.itemCount", { count: order.items.length })}
					</p>
				</div>
			</div>

			<div className="flex overflow-x-auto gap-4 px-6 py-5 scrollbar-hide">
				{order.items.map((item) => (
					<div key={item.id} className="overflow-hidden relative shrink-0 size-[8rem] bg-(--color-surface-card)">
						<Image src={item.thumbnail} alt={item.title} fill sizes="80px" className="object-cover" unoptimized />
						{item.quantity > 1 && (
							<span className="flex absolute top-1 right-1 justify-center items-center px-1 min-w-[2rem] h-[2rem] text-[1.1rem] font-semibold text-white rounded-full bg-(--color-ink)">
								{item.quantity}
							</span>
						)}
					</div>
				))}
			</div>

			<div className="flex justify-between items-start px-6 py-4 border-t md:items-center max-md:flex-col max-md:gap-y-4 border-(--color-surface-border)">
				<Link
					href={`/account/orders/${order.id}`}
					className="flex items-center text-[1.3rem] font-semibold tracking-[0.08em] uppercase transition-colors group/link text-(--color-ink)"
				>
					{t("orderCard.viewDetails")}
					<ArrowRightIcon className="ml-2 w-4 h-4 opacity-0 transition-all duration-200 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0" />
				</Link>

				{/* <Button className="py-4 text-white bg-black rounded-full w-fit">
					Suivre le colis
				</Button> */}
			</div>
		</div>
	);
};
