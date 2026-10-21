"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
	window.addEventListener("online", onChange);
	window.addEventListener("offline", onChange);
	return () => {
		window.removeEventListener("online", onChange);
		window.removeEventListener("offline", onChange);
	};
};

/**
 * Bandeau « hors ligne ». Rassure sur le panier, conservé dans le navigateur,
 * pendant que les pages et l'API attendent le retour du réseau.
 */
export function OfflineBanner() {
	const t = useTranslations("Pwa.offline");
	const online = useSyncExternalStore(
		subscribe,
		() => navigator.onLine,
		// Rendu serveur : supposé en ligne, pour ne rien afficher par erreur.
		() => true,
	);

	if (online) return null;

	return (
		<div
			role="status"
			className="fixed inset-x-0 top-0 z-50 px-4 py-2 text-[1.3rem] font-medium text-center text-white bg-stone-800"
		>
			{t("message")}
		</div>
	);
}
