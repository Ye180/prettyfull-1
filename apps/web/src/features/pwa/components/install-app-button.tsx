"use client";

import { useTranslations } from "next-intl";
import { selectCanInstall, usePwaStore } from "../stores/use-pwa-store";

/**
 * Accès permanent à l'installation (pied de page), même après « Plus tard »
 * sur le bandeau. Invisible si l'app est déjà installée ou si le navigateur
 * ne permet pas l'installation.
 */
export function InstallAppButton({ className }: { className?: string }) {
	const t = useTranslations("Pwa.install");
	const canInstall = usePwaStore(selectCanInstall);
	const hasNativePrompt = usePwaStore((state) => state.installEvent !== null);
	const promptInstall = usePwaStore((state) => state.promptInstall);
	const requestGuide = usePwaStore((state) => state.requestGuide);

	if (!canInstall) return null;

	return (
		<button
			type="button"
			onClick={() => (hasNativePrompt ? void promptInstall() : requestGuide())}
			className={className}
		>
			<svg
				className="size-[1.6rem]"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<rect x="6" y="2" width="12" height="20" rx="2.5" />
				<path d="M12 7v7M9 11l3 3 3-3" />
			</svg>
			{t("footerCta")}
		</button>
	);
}
