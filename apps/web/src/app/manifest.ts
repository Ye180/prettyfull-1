import type { MetadataRoute } from "next";

/**
 * Manifeste de l'application web (servi sur `/manifest.webmanifest`).
 *
 * C'est lui qui rend le site installable : nom et icône sur l'écran
 * d'accueil, ouverture plein écran sans barre d'adresse (`standalone`),
 * couleurs de l'écran de lancement. Next injecte la balise `<link>` tout seul.
 *
 * Icônes générées par `scripts/pwa-icons.sh`. Le guide complet est dans
 * `docs/pwa.md`.
 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		// Identité stable de l'app : changer `start_url` plus tard ne crée pas
		// une « nouvelle » application chez les clientes qui l'ont installée.
		id: "/",
		name: "Prettyfull",
		short_name: "Prettyfull",
		description: "Vitamines et compléments alimentaires, livrés chez vous.",
		// `source=pwa` distingue les visites depuis l'app installée dans les statistiques.
		start_url: "/?source=pwa",
		scope: "/",
		display: "standalone",
		background_color: "#ffffff",
		// Même blanc que le header : la barre d'état se fond dans l'app.
		theme_color: "#ffffff",
		lang: "fr",
		dir: "ltr",
		categories: ["shopping", "health", "lifestyle"],
		icons: [
			{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
			{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
			{
				src: "/icons/icon-maskable-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
		// Appui long sur l'icône (Android, Windows, macOS).
		shortcuts: [
			{
				name: "Nos produits",
				url: "/collections?source=pwa",
				icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
			},
			{
				name: "Mon panier",
				url: "/cart?source=pwa",
				icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
			},
			{
				name: "Mes commandes",
				url: "/account/orders?source=pwa",
				icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
			},
		],
	};
}
