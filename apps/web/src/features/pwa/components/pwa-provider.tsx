"use client";

import { useEffect } from "react";
import { type BeforeInstallPromptEvent, usePwaStore } from "../stores/use-pwa-store";
import { InstallBanner } from "./install-banner";
import { OfflineBanner } from "./offline-banner";
import { UpdateBanner } from "./update-banner";

const isStandaloneDisplay = (): boolean =>
	window.matchMedia("(display-mode: standalone)").matches ||
	// Safari iOS : propriété non standard, seule source fiable.
	(navigator as Navigator & { standalone?: boolean }).standalone === true;

/** iPadOS se présente comme un Mac : on le reconnaît à son écran tactile. */
const isIOSDevice = (): boolean =>
	/iPad|iPhone|iPod/.test(navigator.userAgent) ||
	(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/**
 * Socle de la PWA, monté une seule fois dans le layout racine.
 *
 *  - enregistre le service worker (`public/sw.js`), en production uniquement :
 *    en développement, un cache rendrait les modifications invisibles ;
 *  - capte l'invite d'installation de Chromium, qui ne se déclenche qu'une
 *    fois par chargement et doit donc être gardée pour plus tard ;
 *  - détecte les nouvelles versions et les propose sans les imposer.
 */
export function PwaProvider() {
	useEffect(() => {
		usePwaStore.setState({
			ready: true,
			isStandalone: isStandaloneDisplay(),
			isIOS: isIOSDevice(),
		});

		const onBeforeInstallPrompt = (event: Event) => {
			// Empêche la mini-barre native de Chrome : c'est notre bandeau qui
			// propose l'installation, au bon moment.
			event.preventDefault();
			usePwaStore.setState({ installEvent: event as BeforeInstallPromptEvent });
		};
		const onAppInstalled = () => {
			usePwaStore.setState({ installEvent: null, isStandalone: true, guideRequested: false });
		};

		window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
		window.addEventListener("appinstalled", onAppInstalled);

		const cleanup = () => {
			window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
			window.removeEventListener("appinstalled", onAppInstalled);
		};

		if (!("serviceWorker" in navigator)) return cleanup;

		if (process.env.NODE_ENV !== "production") {
			// Un worker resté d'un `next start` servirait d'anciens fichiers en dev.
			void navigator.serviceWorker
				.getRegistrations()
				.then((registrations) => registrations.forEach((registration) => registration.unregister()));
			return cleanup;
		}

		let registration: ServiceWorkerRegistration | null = null;

		const offerUpdate = (worker: ServiceWorker) => {
			// Sans contrôleur, c'est la toute première installation : rien à mettre à jour.
			if (navigator.serviceWorker.controller) usePwaStore.setState({ waitingWorker: worker });
		};

		const onControllerChange = () => {
			// Ne recharger que sur demande : `clients.claim()` à la première
			// visite déclenche aussi cet événement.
			if (usePwaStore.getState().updating) window.location.reload();
		};

		// Une app installée peut rester ouverte des jours : on revérifie au
		// retour au premier plan.
		const onVisibilityChange = () => {
			if (document.visibilityState === "visible") void registration?.update().catch(() => {});
		};

		navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
		document.addEventListener("visibilitychange", onVisibilityChange);

		navigator.serviceWorker
			.register("/sw.js", { scope: "/", updateViaCache: "none" })
			.then((reg) => {
				registration = reg;
				if (reg.waiting) offerUpdate(reg.waiting);

				reg.addEventListener("updatefound", () => {
					const worker = reg.installing;
					worker?.addEventListener("statechange", () => {
						if (worker.state === "installed") offerUpdate(worker);
					});
				});
			})
			.catch((error) => console.error("[pwa] service worker non enregistré", error));

		return () => {
			cleanup();
			navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, []);

	return (
		<>
			<OfflineBanner />
			<UpdateBanner />
			<InstallBanner />
		</>
	);
}
