"use client";

import { ArrowLinearIcon } from "@/components/icons/arrow-linear-icon";
import { useGetCustomerOrders } from "@/features/account/api/get-orders";
import { useDisplayCurrency } from "@/hooks/use-display-currency";
import { fetchAddresses, fetchProfile, updateProfile } from "@/lib/store-api";
import type { CurrencyCode } from "@prettyfull/contracts";
import { Input, Skeleton } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWishlistStore } from "@prettyfull/store";

const StatCard = ({ label, value, href }: { label: string; value: string; href: string }) => (
	<Link
		href={href}
		className="flex flex-col justify-between p-7 min-h-[16rem] transition-colors group bg-(--color-surface-card) hover:bg-(--color-surface-border)/60"
	>
		<div className="flex justify-between items-start">
			<p className="text-[1.2rem] font-semibold tracking-[0.12em] uppercase text-(--color-surface-muted)">{label}</p>
			<span className="text-(--color-ink) transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
				<ArrowLinearIcon className="w-5 h-5 rotate-45" />
			</span>
		</div>
		<p className="text-[4.4rem] leading-none text-(--color-ink) [font-family:var(--font-display)]">{value}</p>
	</Link>
);

const statusLabels: Record<
	string,
	{ statusKey: string; className: string }
> = {
	not_fulfilled: {
		statusKey: "processing",
		className: "bg-sky-50 text-sky-800",
	},
	fulfilled: { statusKey: "delivered", className: "bg-emerald-50 text-emerald-800" },
	delivered: { statusKey: "delivered", className: "bg-emerald-50 text-emerald-800" },
	shipped: { statusKey: "shipped", className: "bg-indigo-50 text-indigo-800" },
	canceled: { statusKey: "cancelled", className: "bg-red-50 text-red-800" },
	pending: { statusKey: "pending", className: "bg-amber-50 text-amber-800" },
};

export default function AccountPage() {
	const t = useTranslations("Account");

	const { data: profile } = useQuery({
		queryKey: ["customer-profile"],
		queryFn: fetchProfile,
		retry: false,
	});

	const { data: addresses } = useQuery({
		queryKey: ["customer-addresses"],
		queryFn: fetchAddresses,
		retry: false,
	});

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	// Les champs sont initialisés à l'arrivée du profil, puis laissés à la
	// cliente : les réécrire à chaque rafraîchissement effacerait sa saisie.
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		if (!profile || hydrated) return;

		setFirstName(profile.firstName);
		setLastName(profile.lastName);
		setPhone(profile.phone ?? "");
		setHydrated(true);
	}, [profile, hydrated]);

	const email = profile?.email ?? "";
	const customer = {
		first_name: firstName,
		email,
		addresses: addresses ?? [],
	};

	const { format } = useDisplayCurrency();
	const wishlistCount = useWishlistStore((state) => state.items.length);

	const { data: ordersData, isLoading: ordersLoading } = useGetCustomerOrders();
	const orders = ordersData?.orders ?? [];
	const ordersCount = ordersData?.count ?? 0;

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		setSaveSuccess(false);
		setSaveError(null);

		try {
			await updateProfile({ firstName, lastName, phone: phone || null });
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);
		} catch (error) {
			setSaveError(
				error instanceof Error
					? error.message
					: t("overview.personalInfo.saveError"),
			);
		} finally {
			setIsSaving(false);
		}
	};

	const lastOrder = orders[0];
	const lastOrderStatusMeta = lastOrder
		? statusLabels[lastOrder.status] || statusLabels.pending
		: null;
	const lastOrderStatus = lastOrderStatusMeta
		? {
				className: lastOrderStatusMeta.className,
				label: t(`orders.status.${lastOrderStatusMeta.statusKey}`),
			}
		: null;

	const defaultAddress =
		addresses?.find((address) => address.isDefaultShipping) ?? addresses?.[0];

	const panel = "flex flex-col justify-between p-7 border border-(--color-surface-border)";
	const panelTitle = "text-[2.2rem] text-(--color-ink) [font-family:var(--font-display)]";
	const outlineButton =
		"flex justify-center items-center py-3.5 mt-8 w-full text-[1.3rem] font-semibold tracking-[0.08em] uppercase border transition-colors border-(--color-ink) text-(--color-ink) hover:bg-(--color-ink) hover:text-white";

	return (
		<div className="space-y-12">
			<div className="flex flex-col gap-5 justify-between sm:flex-row sm:items-end">
				<div>
					<h2 className="text-[3.6rem]! sm:text-[4.4rem]!">{t("menu.overview")}</h2>
					<p className="mt-1 text-[1.5rem] text-(--color-surface-muted)">
						{t("overview.greeting", { name: customer.first_name || customer.email })}
					</p>
				</div>
				<Link
					href="/contact"
					className="px-8 py-3.5 text-[1.3rem] font-medium underline underline-offset-4 transition-colors w-fit text-(--color-surface-muted) hover:text-(--color-ink)"
				>
					{t("overview.needHelp")}
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<StatCard label={t("overview.stats.orders")} value={ordersLoading ? "–" : String(ordersCount)} href="/account/orders" />
				<StatCard label={t("overview.stats.wishlist")} value={String(wishlistCount)} href="/wishlist" />
				<StatCard label={t("overview.stats.addresses")} value={String(customer.addresses?.length ?? 0)} href="/account/addresses" />
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className={panel}>
					<div>
						<div className="flex gap-4 justify-between items-center">
							<p className={panelTitle}>{t("overview.lastOrder.title")}</p>
							{lastOrderStatus && (
								<span className={`px-3 py-1 text-[1.2rem] font-medium ${lastOrderStatus.className}`}>{lastOrderStatus.label}</span>
							)}
						</div>
						<div className="mt-6">
							{ordersLoading ? (
								<Skeleton className="w-full h-[8rem]" />
							) : lastOrder ? (
								<div className="flex gap-5 items-center">
									<div className="overflow-hidden relative shrink-0 size-[8rem] bg-(--color-surface-card)">
										{lastOrder.items?.[0]?.thumbnail && (
											<Image
												src={lastOrder.items[0].thumbnail}
												alt={lastOrder.items[0].product_title || t("orders.product")}
												fill
												sizes="80px"
												className="object-cover"
												unoptimized
											/>
										)}
									</div>
									<div className="space-y-1">
										<p className="text-[1.5rem] font-medium text-(--color-ink)">
											{t("overview.lastOrder.orderNumber", { id: lastOrder.display_id })}
										</p>
										<p className="text-[1.35rem] text-(--color-surface-muted)">
											{new Date(lastOrder.created_at).toLocaleDateString("fr-FR", {
												day: "numeric",
												month: "long",
												year: "numeric",
											})}
										</p>
										<p className="text-[1.45rem] font-semibold text-(--color-ink)">
											{format(lastOrder.total ?? 0, (lastOrder.currency_code as CurrencyCode) ?? "xof")}
										</p>
									</div>
								</div>
							) : (
								<p className="text-[1.45rem] text-(--color-surface-muted)">{t("overview.lastOrder.empty")}</p>
							)}
						</div>
					</div>
					<Link href="/account/orders" className={outlineButton}>
						{t("overview.lastOrder.viewOrders")}
					</Link>
				</div>

				<div className={panel}>
					<div>
						<p className={panelTitle}>{t("overview.defaultAddress.title")}</p>
						<address className="mt-6 space-y-1 text-[1.45rem] not-italic leading-relaxed text-(--color-ink)/75">
							{defaultAddress ? (
								<>
									<p className="font-medium text-(--color-ink)">
										{defaultAddress.firstName} {defaultAddress.lastName}
									</p>
									<p>{defaultAddress.address1}</p>
									{defaultAddress.address2 && <p>{defaultAddress.address2}</p>}
									<p>
										{defaultAddress.postalCode} {defaultAddress.city}
									</p>
									<p>{defaultAddress.countryCode?.toUpperCase()}</p>
								</>
							) : (
								<p className="text-(--color-surface-muted)">{t("overview.defaultAddress.empty")}</p>
							)}
						</address>
					</div>
					<Link href="/account/addresses" className={outlineButton}>
						{t("overview.defaultAddress.viewAddresses")}
					</Link>
				</div>
			</div>

			<div className="pt-12 space-y-8 border-t border-(--color-surface-border)">
				<div>
					<h2 className="text-[3rem]! sm:text-[3.6rem]!">{t("overview.personalInfo.title")}</h2>
					<p className="mt-1 text-[1.5rem] text-(--color-surface-muted)">{t("overview.personalInfo.subtitle")}</p>
				</div>
				<form className="p-7 space-y-6 border sm:p-10 border-(--color-surface-border)" onSubmit={handleSaveProfile}>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<Input
							label={t("overview.personalInfo.firstName")}
							placeholder={t("overview.personalInfo.firstNamePlaceholder")}
							className="h-fit"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
						<Input
							label={t("overview.personalInfo.lastName")}
							placeholder={t("overview.personalInfo.lastNamePlaceholder")}
							className="h-fit"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
						<Input
							type="email"
							label={t("overview.personalInfo.email")}
							placeholder={t("overview.personalInfo.emailPlaceholder")}
							className="h-fit"
							value={email}
							disabled
						/>
						<Input
							label={t("overview.personalInfo.phone")}
							placeholder={t("addresses.phonePlaceholder")}
							className="h-fit"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
					</div>
					<div className="flex flex-wrap gap-4 items-center pt-2">
						<button
							type="submit"
							disabled={isSaving}
							className="px-10 py-4 text-[1.35rem] font-semibold tracking-[0.1em] text-white uppercase transition-colors cursor-pointer bg-(--color-ink) hover:bg-black disabled:opacity-60"
						>
							{isSaving ? t("overview.personalInfo.saving") : t("overview.personalInfo.save")}
						</button>
						{saveSuccess && <span className="text-[1.35rem] text-emerald-700">{t("overview.personalInfo.saveSuccess")}</span>}
						{saveError && <span className="text-[1.35rem] text-red-700">{saveError}</span>}
					</div>
				</form>
			</div>
		</div>
	);
}
