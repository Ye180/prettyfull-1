"use client";

import { sdk } from "@/lib/api/sdk";
import { cn } from "@prettyfull/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AddressIcon } from "../../../../../../packages/ui/src/icons/adresse.icon";
import { DashboardIcon } from "../../../../../../packages/ui/src/icons/dashboard.icon";
import { Heart } from "../../../../../../packages/ui/src/icons/heart.icon";
import { LogoutIcon } from "../../../../../../packages/ui/src/icons/logout.icon";
import { OrderIcon } from "../../../../../../packages/ui/src/icons/order.icon";

const menuItems = [
	{
		label: "Overview",
		href: "/account",
		icon: DashboardIcon,
	},
	{
		label: "My Orders",
		href: "/account/orders",
		icon: OrderIcon,
	},
	{
		label: "Addresses",
		href: "/account/addresses",
		icon: AddressIcon,
	},
	{
		label: "My Wishlist",
		href: "/account/wishlist",
		icon: Heart,
	},
];

export const AccountMenu = () => {
	const pathname = usePathname();
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await sdk.auth.logout();
		} catch (e) {
			// ignore
		}
		localStorage.removeItem("cart_id");
		router.push("/login");
	};

	return (
		<nav className="flex flex-col h-full bg-white rounded-md border border-gray-100 transition-all duration-200 shadow-2xs">
			<div className="px-7 py-8 border-b border-gray-100">
				<h3 className="text-2xl! font-bold tracking-wider text-gray-900">
					My account
				</h3>
				<p className="mt-2 text-gray-500 text-md">Manage your preferences</p>
			</div>

			<div className="flex-1 px-4 py-6 space-y-2">
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
								"flex overflow-hidden relative items-center px-5 py-4 text-base font-medium rounded-xl transition-all duration-200 group",
								isActive
									? "text-gray-900 bg-gray-50/80"
									: "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
							)}
						>
							{isActive && (
								<span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-black rounded-r-full" />
							)}

							<Icon
								className={cn(
									"mr-4 w-6 h-6 transition-colors duration-200",
									isActive
										? "text-gray-900"
										: "text-gray-400 group-hover:text-gray-900",
								)}
							/>
							{item.label}
						</Link>
					);
				})}
			</div>

			<div className="p-5 mt-auto border-t border-gray-100">
				<button
					onClick={handleLogout}
					className="flex items-center px-5 py-4 w-full text-base font-medium text-gray-500 rounded-xl transition-all duration-200 hover:text-red-600 hover:bg-red-50 group"
				>
					<LogoutIcon className="mr-4 w-6 h-6 text-gray-400 transition-colors group-hover:text-red-500" />
					Logout
				</button>
			</div>
		</nav>
	);
};
