/**
 * Service worker du storefront Prettyfull.
 *
 * Volontairement prudent : il accélère les ressources statiques et affiche
 * une page « hors ligne » quand le réseau manque, mais ne met **jamais** une
 * page HTML ni une réponse d'API en cache. Une page en cache pourrait montrer
 * un prix périmé, un stock faux ou les données d'une autre session.
 *
 * Mise à jour : modifier `VERSION` à chaque changement de ce fichier. Le
 * navigateur installe alors la nouvelle version en attente, et le site
 * propose « Mettre à jour » (message `SKIP_WAITING`).
 *
 * Guide complet : docs/pwa.md
 */

const VERSION = "v1";
const PRECACHE = `pf-precache-${VERSION}`;
const STATIC_CACHE = `pf-static-${VERSION}`;
const MEDIA_CACHE = `pf-media-${VERSION}`;
const MEDIA_MAX_ENTRIES = 150;

const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [
	OFFLINE_URL,
	"/icons/icon-192.png",
	"/icons/icon-512.png",
];

/** Jamais interceptés : données personnelles, paiement, API, outillage dev. */
const BYPASS_PREFIXES = [
	"/api/",
	"/_next/webpack-hmr",
	"/checkout",
	"/account",
	"/order-confirmation",
	"/login",
	"/create-account",
];

const MEDIA_PREFIXES = [
	"/_next/image",
	"/assets/",
	"/products/",
	"/home/",
	"/category/",
	"/icons/",
	"/fonts/",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
	);
	// Pas de skipWaiting ici : une nouvelle version attend l'accord de
	// l'utilisateur, pour ne pas changer le code sous une page déjà ouverte.
});

self.addEventListener("activate", (event) => {
	const current = [PRECACHE, STATIC_CACHE, MEDIA_CACHE];
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key.startsWith("pf-") && !current.includes(key))
						.map((key) => caches.delete(key)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

self.addEventListener("message", (event) => {
	if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;

	const url = new URL(request.url);
	// L'API backend est sur une autre origine : elle passe toujours au réseau.
	if (url.origin !== self.location.origin) return;
	if (BYPASS_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return;
	// Données des Server Components (navigation client Next.js).
	if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;

	if (request.mode === "navigate") {
		event.respondWith(networkOrOffline(request));
		return;
	}

	// Fichiers hachés par Next : leur contenu ne change jamais pour une URL donnée.
	if (url.pathname.startsWith("/_next/static/")) {
		event.respondWith(cacheFirst(request, STATIC_CACHE));
		return;
	}

	if (MEDIA_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
		event.respondWith(staleWhileRevalidate(event, request, MEDIA_CACHE));
	}
});

/** Pages : toujours le réseau ; la page hors ligne seulement s'il est injoignable. */
async function networkOrOffline(request) {
	try {
		return await fetch(request);
	} catch {
		const offline = await caches.match(OFFLINE_URL);
		return offline ?? Response.error();
	}
}

async function cacheFirst(request, cacheName) {
	const cached = await caches.match(request);
	if (cached) return cached;

	const response = await fetch(request);
	if (response.ok) {
		const cache = await caches.open(cacheName);
		await cache.put(request, response.clone());
	}
	return response;
}

/** Réponse immédiate depuis le cache, rafraîchie en arrière-plan. */
async function staleWhileRevalidate(event, request, cacheName) {
	const cache = await caches.open(cacheName);
	const cached = await cache.match(request);

	const refresh = fetch(request)
		.then(async (response) => {
			if (response.ok) {
				await cache.put(request, response.clone());
				await trim(cache, MEDIA_MAX_ENTRIES);
			}
			return response;
		})
		.catch(() => cached ?? Response.error());

	if (cached) {
		event.waitUntil(refresh);
		return cached;
	}
	return refresh;
}

/** Supprime les entrées les plus anciennes au-delà de `max`. */
async function trim(cache, max) {
	const keys = await cache.keys();
	await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((key) => cache.delete(key)));
}
