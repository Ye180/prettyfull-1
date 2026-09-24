"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { IconMenu, IconX } from "@/components/icons";
import { Spinner } from "@/components/ui/primitives";
import { useRequireAuth } from "@/lib/auth";

/**
 * Coquille du panel : navigation latérale fixe au-delà de 1024 px, tiroir
 * en dessous.
 *
 * Tant que la reprise de session n'a pas abouti, on n'affiche ni le contenu
 * ni la page de connexion : montrer brièvement l'un puis l'autre à chaque
 * rechargement donnerait l'impression d'une déconnexion permanente.
 */
const PanelLayout = ({ children }: { children: ReactNode }) => {
	const { user, isLoading } = useRequireAuth();
	const [drawerOpen, setDrawerOpen] = useState(false);

	if (isLoading) {
		return (
			<div className="flex min-h-dvh items-center justify-center">
				<Spinner label="Chargement de la session…" />
			</div>
		);
	}

	// La redirection est prise en charge par `useRequireAuth`.
	if (!user) return null;

	return (
		<div className="flex min-h-dvh">
			<aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-line lg:block">
				<Sidebar />
			</aside>

			{drawerOpen && (
				<div className="fixed inset-0 z-40 lg:hidden">
					<button
						type="button"
						aria-label="Fermer la navigation"
						className="absolute inset-0 bg-black/40"
						onClick={() => setDrawerOpen(false)}
					/>
					<div className="absolute inset-y-0 left-0 w-60 border-r border-line">
						<Sidebar onNavigate={() => setDrawerOpen(false)} />
					</div>
				</div>
			)}

			<div className="flex min-w-0 flex-1 flex-col lg:pl-60">
				<header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-raised px-4 lg:hidden">
					<button
						type="button"
						onClick={() => setDrawerOpen((open) => !open)}
						aria-label="Ouvrir la navigation"
						className="rounded-md p-1.5 text-muted hover:bg-accent-soft hover:text-ink"
					>
						{drawerOpen ? <IconX /> : <IconMenu />}
					</button>
					<span className="font-semibold text-ink">PrettyFull</span>
				</header>

				<main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
					<div className="mx-auto w-full max-w-[1400px]">{children}</div>
				</main>
			</div>
		</div>
	);
};

export default PanelLayout;
