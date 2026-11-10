"use client";

import { create } from "zustand";

/**
 * Événement d'installation de Chromium (Android, Windows, macOS, ChromeOS).
 * Absent des types DOM standard : il n'existe ni dans Safari ni dans Firefox.
 */
export interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Après « Plus tard », le bandeau ne revient pas avant ce délai. */
const DISMISS_DAYS = 14;
const DISMISS_KEY = "pf-pwa-install-dismissed-until";

interface PwaState {
	/** Détection faite côté navigateur ; rien n'est affiché avant. */
	ready: boolean;
	/** Ouvert depuis l'icône de l'écran d'accueil (ou installé à l'instant). */
	isStandalone: boolean;
	/** iPhone / iPad : pas d'invite native, installation guidée par le menu Partager. */
	isIOS: boolean;
	/** Invite native différée, utilisable une seule fois. */
	installEvent: BeforeInstallPromptEvent | null;
	/** Nouvelle version du service worker installée, en attente d'activation. */
	waitingWorker: ServiceWorker | null;
	/** La cliente a demandé la mise à jour : le prochain changement de worker recharge la page. */
	updating: boolean;
	/** Guide d'installation demandé explicitement (bouton du footer). */
	guideRequested: boolean;

	/** Ouvre l'invite native ; renvoie `true` si la cliente a accepté. */
	promptInstall: () => Promise<boolean>;
	applyUpdate: () => void;
	requestGuide: () => void;
	closeGuide: () => void;
}

export const usePwaStore = create<PwaState>((set, get) => ({
	ready: false,
	isStandalone: false,
	isIOS: false,
	installEvent: null,
	waitingWorker: null,
	updating: false,
	guideRequested: false,

	promptInstall: async () => {
		const event = get().installEvent;
		if (!event) return false;

		await event.prompt();
		const { outcome } = await event.userChoice;
		// Un même événement ne peut servir qu'une fois.
		set({ installEvent: null, guideRequested: false });
		return outcome === "accepted";
	},

	applyUpdate: () => {
		const worker = get().waitingWorker;
		if (!worker) return;
		set({ updating: true });
		worker.postMessage({ type: "SKIP_WAITING" });
	},

	requestGuide: () => set({ guideRequested: true }),
	closeGuide: () => set({ guideRequested: false }),
}));

/** Installation possible ici et maintenant (invite native ou guide iOS). */
export const selectCanInstall = (state: PwaState): boolean =>
	state.ready && !state.isStandalone && (state.installEvent !== null || state.isIOS);

export const isInstallDismissed = (): boolean => {
	try {
		return Number(localStorage.getItem(DISMISS_KEY) ?? 0) > Date.now();
	} catch {
		return false;
	}
};

export const dismissInstall = (): void => {
	try {
		localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 86_400_000));
	} catch {
		// Stockage indisponible (navigation privée) : le bandeau reviendra, sans gravité.
	}
};
