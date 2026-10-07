/**
 * Redirection après connexion/inscription.
 *
 * Navigation complète (pas `router.push`) : le cache du routeur client garde
 * la réponse obtenue avant connexion - le renvoi du proxy vers `/login` - et
 * la rejouerait, laissant la cliente bloquée sur la page de login.
 *
 * Seuls les chemins internes sont suivis : `?redirect=//site.com` ou une URL
 * absolue ne doivent pas faire sortir de la boutique (open redirect).
 */
export const redirectAfterAuth = (target: string | null) => {
	const safeTarget =
		target?.startsWith("/") && !target.startsWith("//") ? target : "/account";
	window.location.assign(safeTarget);
};
