/**
 * Résolution des URL de visuels.
 *
 * Le catalogue stocke des chemins relatifs au storefront (`/home/arrivals-1.jpg`,
 * servis depuis `apps/web/public`). Tels quels, le back-office les résoudrait
 * contre son propre domaine et n'afficherait que des images cassées : on les
 * préfixe donc par l'URL publique de la boutique.
 *
 * Les URL absolues et les `data:` sont laissées intactes.
 */
const STOREFRONT_URL = (
	process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const mediaUrl = (path: string | null | undefined): string | null => {
	if (!path) return null;

	const trimmed = path.trim();
	if (!trimmed) return null;

	if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;

	return `${STOREFRONT_URL}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
};
