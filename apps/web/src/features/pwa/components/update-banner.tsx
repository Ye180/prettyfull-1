"use client";

import { useTranslations } from "next-intl";
import { usePwaStore } from "../stores/use-pwa-store";

/**
 * Nouvelle version du site disponible.
 *
 * Proposée, jamais imposée : remplacer le code sous une page ouverte pourrait
 * interrompre un formulaire en cours. Un clic active la nouvelle version et
 * recharge la page.
 */
export function UpdateBanner() {
	const t = useTranslations("Pwa.update");
	const hasUpdate = usePwaStore((state) => state.waitingWorker !== null);
	const updating = usePwaStore((state) => state.updating);
	const applyUpdate = usePwaStore((state) => state.applyUpdate);

	if (!hasUpdate) return null;

	return (
		<div
			role="status"
			className="flex fixed left-1/2 top-4 z-50 gap-4 items-center py-2 pr-2 pl-5 w-max max-w-[calc(100vw-3.2rem)] text-[1.4rem] text-white rounded-full shadow-lg -translate-x-1/2 bg-(--color-brand)"
		>
			<span>{t("message")}</span>
			<button
				type="button"
				onClick={applyUpdate}
				disabled={updating}
				className="px-4 min-h-[3.6rem] font-semibold bg-white rounded-full transition-colors text-gray-950 hover:bg-stone-200 disabled:opacity-60"
			>
				{updating ? t("updating") : t("cta")}
			</button>
		</div>
	);
}
