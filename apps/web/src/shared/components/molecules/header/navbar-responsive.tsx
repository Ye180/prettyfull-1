import type { AuthMode } from "@/features/auth/components";
import { COLLECTION_PATHS, paths } from "@/lib/routes/paths-en";
import { NAV_INFO_LINKS } from "@/lib/utils/constants/header";
import type { StoreCategory } from "@/lib/store-api/types";
import type { User as UserProfile } from "@prettyfull/contracts";
import { Logo, LogOut, ScrollArea, Skeleton, User } from "@prettyfull/ui";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { CurrencySelector } from "./currency-selector";
import SearchBar from "./search-bar";

const NavbarResponsive = ({
	close,
	main_category,
	onOpenAuth,
	profile,
	onLogout,
}: {
	close: () => void;
	main_category?: StoreCategory[];
	onOpenAuth: (mode: AuthMode) => void;
	profile?: UserProfile;
	onLogout: () => void;
}) => {
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const toggleExpanded = (handle: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(handle)) next.delete(handle);
			else next.add(handle);
			return next;
		});
	};

	return createPortal(
		<div className="fixed inset-0 z-40 flex justify-end">
			{/* Backdrop - desktop only, mobile stays full-bleed */}
			<button
				aria-label="Fermer le menu"
				onClick={close}
				className="hidden md:block absolute inset-0 bg-black/40 cursor-pointer"
			/>

			<div className="overflow-hidden relative w-full h-full bg-white md:w-[440px] md:shadow-2xl flex flex-col">
				{/* Header avec logo et icônes */}
				<div className="flex justify-between items-center px-4 pt-10 pb-4 border-b border-gray-200 shrink-0">
					<Link href="/" onClick={close}>
						<Logo className="w-48 md:w-56" />
					</Link>

					<div className="flex gap-2 items-center">
						<div className="">
							<CurrencySelector />
						</div>

						{/* Close button */}
						<button
							onClick={close}
							className="p-2 text-gray-600 cursor-pointer hover:text-black focus:outline-none"
							aria-label="Fermer le menu"
						>
							<CloseIcon className="w-10 h-10" />
						</button>
					</div>
				</div>

				{/* Barre de recherche */}
				<div className="px-4 py-3 border-b border-gray-100 shrink-0">
					<SearchBar onNavigate={close} />
				</div>

				{/* Catégories, avec sous-catégories dépliables */}
				<ScrollArea className="flex-1 px-4">
					<div className="flex flex-col gap-y-1 py-4">
						<Link
							href={paths.home}
							onClick={close}
							className="text-[1.5rem] w-full py-3 px-3 hover:bg-gray-50 rounded-md font-semibold text-gray-900 transition-colors"
						>
							Accueil
						</Link>

						{main_category ? (
							main_category.map((cat, index) => {
								const children = cat.category_children ?? [];
								const hasChildren = children.length > 0;
								const isOpen = expanded.has(cat.handle);
								return (
									<div key={cat.id ?? index}>
										<div className="flex items-center">
											<Link
												href={COLLECTION_PATHS.collectionDetail(cat.handle)}
												onClick={close}
												className="flex-1 text-[1.5rem] w-full py-3 px-3 hover:bg-gray-50 rounded-md font-semibold text-gray-900 transition-colors"
											>
												{cat.name}
											</Link>
											{hasChildren && (
												<button
													type="button"
													onClick={() => toggleExpanded(cat.handle)}
													aria-label={`${isOpen ? "Réduire" : "Voir"} les sous-catégories de ${cat.name}`}
													className="p-3 text-gray-500 cursor-pointer hover:text-black"
												>
													<svg
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2.5"
														className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
													>
														<path d="M6 9l6 6 6-6" />
													</svg>
												</button>
											)}
										</div>
										{hasChildren && isOpen && (
											<div className="flex flex-col pl-4 border-l border-gray-100 ml-3 gap-y-1">
												{children.map((child) => (
													<Link
														key={child.handle}
														href={COLLECTION_PATHS.collectionDetail(child.handle)}
														onClick={close}
														className="text-[1.4rem] w-full py-2.5 px-3 hover:bg-gray-50 rounded-md font-normal text-gray-600 hover:text-black transition-colors"
													>
														{child.name}
													</Link>
												))}
											</div>
										)}
									</div>
								);
							})
						) : (
							<Skeleton className="w-full h-9" />
						)}
					</div>

					{/* Auth entry points - the only ones on mobile, since the header's
					 * Login/Sign Up buttons are hidden below the sm breakpoint. */}
					<div className="flex gap-3 border-t border-gray-100 py-4">
						{profile ? (
							<>
								<Link
									href={paths.account}
									onClick={close}
									className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-3 text-[1.4rem] font-medium text-gray-700 text-center transition-colors hover:bg-gray-50 hover:text-black"
								>
									<User className="w-[20px] h-[20px]" />
									{profile.firstName}
								</Link>
								<button
									onClick={() => {
										onLogout();
										close();
									}}
									className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-black px-3 py-3 text-[1.4rem] font-medium text-white transition-colors hover:bg-gray-800 cursor-pointer"
								>
									<LogOut className="w-[20px] h-[20px]" />
									Déconnexion
								</button>
							</>
						) : (
							<>
								<button
									onClick={() => onOpenAuth("login")}
									className="flex-1 rounded-lg border border-gray-200 px-3 py-3 text-[1.4rem] font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-black cursor-pointer"
								>
									Connexion
								</button>
								<button
									onClick={() => onOpenAuth("register")}
									className="flex-1 rounded-lg bg-black px-3 py-3 text-[1.4rem] font-medium text-white transition-colors hover:bg-gray-800 cursor-pointer"
								>
									S&apos;inscrire
								</button>
							</>
						)}
					</div>

					{/*
					 * Pages d'information, après les rayons : on vient d'abord ici pour
					 * acheter. Le séparateur marque le changement de nature des liens.
					 */}
					<div className="flex flex-col gap-y-1 border-t border-gray-100 py-4">
						{NAV_INFO_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								onClick={close}
								className="w-full rounded-md px-3 py-3 text-[1.4rem] font-normal text-gray-500 transition-colors hover:bg-gray-50 hover:text-black"
							>
								{link.label}
							</Link>
						))}
					</div>
				</ScrollArea>
			</div>
		</div>,
		document.body,
	);
};

export default NavbarResponsive;
