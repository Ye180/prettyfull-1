"use client";

export type AppLocale = "fr" | "en";

/** Écrit le cookie que lit `i18n/request.ts` - le composant appelant doit ensuite déclencher `router.refresh()`. */
export const setLocaleCookie = (locale: AppLocale) => {
	document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
};
