"use client";

import { cn } from "@prettyfull/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
	dismissInstall,
	isInstallDismissed,
	selectCanInstall,
	usePwaStore,
} from "../stores/use-pwa-store";

/** Le bandeau attend que la cliente ait commencé à explorer le site. */
const SHOW_AFTER_MS = 15_000;

/** Jamais de sollicitation pendant le paiement ou la connexion. */
const QUIET_PATHS = ["/checkout", "/order-confirmation", "/login", "/create-account"];

/** Icône « Partager » de Safari : carré ouvert, flèche vers le haut. */
const ShareIcon = () => (
	<svg
		className="inline-block -mt-1 size-[1.8rem] text-sky-600"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M8 10H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2" />
		<path d="M12 15V2" />
		<path d="m8 6 4-4 4 4" />
	</svg>
);

const AddSquareIcon = () => (
	<svg
		className="inline-block -mt-1 size-[1.8rem]"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<rect x="3" y="3" width="18" height="18" rx="4" />
		<path d="M12 8v8M8 12h8" />
	</svg>
);

/**
 * Invitation à installer l'application.
 *
 * Chromium fournit une invite native (`beforeinstallprompt`) : un clic sur
 * « Installer » suffit. Safari iOS n'en a pas : on montre alors les trois
 * gestes du menu Partager. Le bandeau reste discret (non bloquant), attend
 * 15 s de visite, se tait 14 jours après « Plus tard », et peut toujours être
 * rouvert depuis le pied de page.
 */
export function InstallBanner() {
	const t = useTranslations("Pwa.install");
	const titleId = useId();
	const pathname = usePathname();
	const reduceMotion = useReducedMotion();
	const panelRef = useRef<HTMLDivElement>(null);

	const canInstall = usePwaStore(selectCanInstall);
	const isIOS = usePwaStore((state) => state.isIOS);
	const hasNativePrompt = usePwaStore((state) => state.installEvent !== null);
	const guideRequested = usePwaStore((state) => state.guideRequested);
	const promptInstall = usePwaStore((state) => state.promptInstall);
	const closeGuide = usePwaStore((state) => state.closeGuide);

	// `true` tant que le stockage n'a pas été lu : rien ne s'affiche au rendu serveur.
	const [dismissed, setDismissed] = useState(true);
	const [delayElapsed, setDelayElapsed] = useState(false);
	const [stepsOpen, setStepsOpen] = useState(false);

	useEffect(() => {
		setDismissed(isInstallDismissed());
		const timer = setTimeout(() => setDelayElapsed(true), SHOW_AFTER_MS);
		return () => clearTimeout(timer);
	}, []);

	const quietPage = QUIET_PATHS.some((path) => pathname.startsWith(path));
	const visible =
		canInstall && (guideRequested || (delayElapsed && !dismissed && !quietPage));
	const showSteps = !hasNativePrompt && isIOS && (stepsOpen || guideRequested);

	const close = () => {
		dismissInstall();
		setDismissed(true);
		setStepsOpen(false);
		closeGuide();
	};

	const install = async () => {
		const accepted = await promptInstall();
		if (!accepted) close();
	};

	useEffect(() => {
		if (!visible) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") close();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	// Ouvert depuis le footer : le focus suit, pour le clavier et les lecteurs d'écran.
	useEffect(() => {
		if (guideRequested && visible) panelRef.current?.focus();
	}, [guideRequested, visible]);

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					ref={panelRef}
					role="dialog"
					aria-modal="false"
					aria-labelledby={titleId}
					tabIndex={-1}
					initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
					transition={{ duration: 0.25, ease: "easeOut" }}
					className={cn(
						"fixed inset-x-4 z-50 p-5 bg-white rounded-2xl border shadow-xl outline-none border-stone-200",
						"bottom-[max(1.6rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-6 sm:w-[40rem]",
					)}
				>
					<div className="flex gap-4 items-start">
						{/* eslint-disable-next-line @next/next/no-img-element -- icône locale de 192 px, pas besoin de l'optimiseur */}
						<img
							src="/icons/icon-192.png"
							alt=""
							width={52}
							height={52}
							className="rounded-xl size-[5.2rem] shrink-0"
						/>
						<div className="flex-1 min-w-0">
							<p id={titleId} className="text-[1.7rem] font-semibold text-gray-950">
								{t("title")}
							</p>
							<p className="mt-1 text-[1.4rem] leading-snug text-stone-600">
								{t("description")}
							</p>
						</div>
					</div>

					{showSteps && (
						<ol className="mt-5 space-y-3 text-[1.4rem] text-stone-700">
							{(["step1", "step2", "step3"] as const).map((step, index) => (
								<li key={step} className="flex gap-3 items-start">
									<span className="flex justify-center items-center font-semibold text-white rounded-full size-[2.4rem] shrink-0 text-[1.2rem] bg-(--color-brand)">
										{index + 1}
									</span>
									<span className="pt-0.5">
										{t.rich(`ios.${step}`, {
											share: () => <ShareIcon />,
											add: () => <AddSquareIcon />,
											strong: (chunks) => (
												<strong className="font-semibold text-gray-950">{chunks}</strong>
											),
										})}
									</span>
								</li>
							))}
						</ol>
					)}

					<div className="flex gap-3 justify-end mt-5">
						<button
							type="button"
							onClick={close}
							className="px-5 min-h-[4.4rem] text-[1.4rem] font-semibold rounded-md transition-colors text-stone-600 hover:bg-stone-100 hover:text-gray-950"
						>
							{showSteps ? t("done") : t("later")}
						</button>
						{hasNativePrompt ? (
							<button
								type="button"
								onClick={install}
								className="px-6 min-h-[4.4rem] text-[1.4rem] font-semibold text-white rounded-md transition-colors bg-(--color-brand) hover:bg-black"
							>
								{t("cta")}
							</button>
						) : (
							!showSteps && (
								<button
									type="button"
									onClick={() => setStepsOpen(true)}
									className="px-6 min-h-[4.4rem] text-[1.4rem] font-semibold text-white rounded-md transition-colors bg-(--color-brand) hover:bg-black"
								>
									{t("howTo")}
								</button>
							)
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
