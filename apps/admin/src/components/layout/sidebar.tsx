"use client";

import type { Permission } from "@prettyfull/contracts";
import { PERMISSIONS } from "@prettyfull/contracts";
import { cn } from "@prettyfull/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
	IconCatalog,
	IconContent,
	IconCustomers,
	IconDashboard,
	IconLogout,
	IconOrders,
	IconPlug,
	IconSettings,
	IconShield,
	IconStock,
} from "@/components/icons";

/**
 * Navigation principale : les neuf modules du cahier des charges (§4).
 *
 * Chaque entrée déclare la permission qui la gouverne, et n'apparaît que si
 * le compte la détient. Ce n'est pas une mesure de sécurité — l'API refuse de
 * toute façon — mais un choix d'ergonomie : montrer à un gestionnaire
 * catalogue un menu « Agrégateurs » qui renverra 403 n'aide personne.
 */
interface NavItem {
	href: string;
	label: string;
	icon: typeof IconDashboard;
	permission: Permission;
	/** Correspondance exacte, pour la racine qui préfixe tout le reste. */
	exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
	{ href: "/", label: "Tableau de bord", icon: IconDashboard, permission: PERMISSIONS.dashboard.read, exact: true },
	{ href: "/catalogue", label: "Catalogue", icon: IconCatalog, permission: PERMISSIONS.catalog.read },
	{ href: "/stocks", label: "Stocks", icon: IconStock, permission: PERMISSIONS.inventory.read },
	{ href: "/commandes", label: "Commandes", icon: IconOrders, permission: PERMISSIONS.orders.read },
	{ href: "/clients", label: "Clients", icon: IconCustomers, permission: PERMISSIONS.customers.read },
	{ href: "/agregateurs", label: "Agrégateurs", icon: IconPlug, permission: PERMISSIONS.integrations.read },
	{ href: "/contenu", label: "Contenu", icon: IconContent, permission: PERMISSIONS.content.read },
	{ href: "/utilisateurs", label: "Utilisateurs & rôles", icon: IconShield, permission: PERMISSIONS.staff.read },
	{ href: "/parametres", label: "Paramètres", icon: IconSettings, permission: PERMISSIONS.settings.read },
];

export const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
	const pathname = usePathname();
	const { user, can, logout } = useAuth();

	const isActive = (item: NavItem) =>
		item.exact ? pathname === item.href : pathname.startsWith(item.href);

	return (
		<nav className="flex h-full flex-col bg-raised">
			<div className="flex h-14 items-center gap-2 border-b border-line px-4">
				<span className="flex size-7 items-center justify-center rounded-md bg-accent text-[13px] font-bold text-accent-ink">
					P
				</span>
				<span className="font-semibold tracking-tight text-ink">PrettyFull</span>
			</div>

			<ul className="flex-1 space-y-0.5 overflow-y-auto p-2 no-scrollbar">
				{NAV_ITEMS.filter((item) => can(item.permission)).map((item) => {
					const Icon = item.icon;
					const active = isActive(item);

					return (
						<li key={item.href}>
							<Link
								href={item.href}
								onClick={onNavigate}
								aria-current={active ? "page" : undefined}
								className={cn(
									"flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] transition-colors",
									active
										? "bg-accent-soft font-medium text-ink"
										: "text-muted hover:bg-accent-soft hover:text-ink",
								)}
							>
								<Icon width={17} height={17} className="shrink-0" />
								<span className="truncate">{item.label}</span>
							</Link>
						</li>
					);
				})}
			</ul>

			<div className="border-t border-line p-2">
				<div className="px-2.5 py-1.5">
					<p className="truncate text-[13px] font-medium text-ink">
						{user ? `${user.firstName} ${user.lastName}` : "—"}
					</p>
					<p className="truncate text-[12px] text-subtle">{user?.email}</p>
				</div>

				<button
					type="button"
					onClick={() => void logout()}
					className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-muted transition-colors hover:bg-accent-soft hover:text-ink"
				>
					<IconLogout width={17} height={17} />
					Déconnexion
				</button>
			</div>
		</nav>
	);
};
