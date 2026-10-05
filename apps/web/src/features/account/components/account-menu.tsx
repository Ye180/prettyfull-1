"use client";

import { useLogout } from "@/features/auth/api/logout";
import { cn } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AddressIcon } from "../../../../../../packages/ui/src/icons/adresse.icon";
import { DashboardIcon } from "../../../../../../packages/ui/src/icons/dashboard.icon";
import { Heart } from "../../../../../../packages/ui/src/icons/heart.icon";
import { LogoutIcon } from "../../../../../../packages/ui/src/icons/logout.icon";
import { OrderIcon } from "../../../../../../packages/ui/src/icons/order.icon";

export const AccountMenu = () => {
	const t = useTranslations("Account.menu");
	const pathname = usePathname();
	const logoutMutation = useLogout();

	const menuItems = [
		{
			label: t("overview"),
			href: "/account",
			icon: DashboardIcon,
		},
		{
			label: t("myOrders"),
			href: "/account/orders",
			icon: OrderIcon,
		},
		{
			label: t("addresses"),
			href: "/account/addresses",
			icon: AddressIcon,
		},
		{
			label: t("wishlist"),
			href: "/account/wishlist",
			icon: Heart,
		},
	];

	const handleLogout = () => {
		logoutMutation.mutate();
	};

	return (
		<nav className="flex flex-col bg-(--color-surface-card)">
			<div className="hidden px-7 pt-8 pb-6 border-b md:block border-(--color-surface-border)">
				<p className="text-[2.4rem] text-(--color-ink) [font-family:var(--font-display)]">{t("myAccount")}</p>
				<p className="mt-1 text-[1.35rem] leading-relaxed text-(--color-surface-muted)">{t("managePreferences")}</p>
			</div>

			<div className="flex overflow-x-auto gap-1 p-2 md:flex-col md:p-3 scrollbar-hide">
				{menuItems.map((item) => {
					const Icon = item.icon;
					const isActive =
						pathname === item.href ||
						(item.href !== "/account" && pathname.startsWith(item.href));

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex relative gap-3.5 items-center px-4 py-3.5 text-[1.45rem] whitespace-nowrap transition-colors",
								isActive
									? "bg-white font-medium text-(--color-ink)"
									: "text-(--color-ink)/65 hover:text-(--color-ink) hover:bg-white/60",
							)}
						>
							{isActive && <span className="hidden absolute inset-y-0 left-0 w-[0.3rem] md:block bg-(--color-ink)" />}
							<Icon className="w-5 h-5 shrink-0" />
							{item.label}
						</Link>
					);
				})}
			</div>

			<div className="hidden p-3 border-t md:block border-(--color-surface-border)">
				<button
					onClick={handleLogout}
					className="flex gap-3.5 items-center px-4 py-3.5 w-full text-[1.45rem] transition-colors cursor-pointer text-(--color-ink)/65 hover:text-red-700"
				>
					<LogoutIcon className="w-5 h-5" />
					{t("logout")}
				</button>
			</div>
		</nav>
	);
};
