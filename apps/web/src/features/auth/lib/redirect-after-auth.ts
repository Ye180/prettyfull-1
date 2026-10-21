/**
 * Redirection après connexion/inscription.
 *
 * Navigation complète (pas `router.push`) : le cache du routeur client garde
 * la réponse obtenue avant connexion - le renvoi du proxy vers `/login` - et
 * la rejouerait, laissant la cliente bloquée sur la page de login.
 *
 * Seuls les chemins internes sont suivis (open redirect). La cible est
 * résolue par le parseur d'URL du navigateur puis son origine comparée :
 * tester des préfixes laisserait passer `/\site.com` ou `/%09/site.com`, que
 * le navigateur transforme en `//site.com`.
 */
export const safeInternalUrl = (target: string | null, fallback = "/account"): string => {
	if (!target) return fallback;
	try {
		const url = new URL(target, window.location.origin);
		// URL absolue, pas seulement le chemin : `/.//site.com` se normalise en
		// `//site.com`, qui redeviendrait une adresse externe.
		return url.origin === window.location.origin ? url.href : fallback;
	} catch {
		return fallback;
	}
};

export const redirectAfterAuth = (target: string | null) => {
	window.location.assign(safeInternalUrl(target));
};
