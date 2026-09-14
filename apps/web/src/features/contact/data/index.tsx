/**
 * Coordonnées et contenu de la page contact.
 *
 * Centralisés ici : ces informations changent (horaires, numéro) sans que la
 * mise en page ait à bouger.
 */

export const CONTACT_DETAILS = {
	email: "contact@prettyfull.shop",
	phone: "+225 07 00 00 00",
	phoneHref: "tel:+22507000000",
	whatsapp: "+225 07 00 00 00",
	address: {
		line1: "Rue des Jardins, Cocody",
		city: "Abidjan",
		country: "Côte d'Ivoire",
	},
	hours: [
		{ days: "Lundi – Vendredi", time: "9 h – 18 h" },
		{ days: "Samedi", time: "10 h – 16 h" },
		{ days: "Dimanche", time: "Fermé" },
	],
} as const;

/** Sujets proposés : ils orientent le message et accélèrent le tri côté panel. */
export const SUBJECTS = [
	"Question sur un produit",
	"Suivi de commande",
	"Retour ou échange",
	"Livraison",
	"Partenariat",
	"Autre",
] as const;

/**
 * Raccourcis vers les réponses déjà écrites.
 *
 * Placés à côté du formulaire, pas après : une question dont la réponse est
 * publiée n'a pas besoin de passer par un message.
 */
export const SHORTCUTS = [
	{
		title: "Où est ma commande ?",
		description: "Suivez son avancement depuis votre espace client.",
		href: "/account/orders",
		cta: "Mes commandes",
	},
	{
		title: "Livraison et retours",
		description: "Délais, zones desservies et conditions de retour.",
		href: "/shipping-return",
		cta: "Consulter",
	},
	{
		title: "Questions fréquentes",
		description: "Tailles, paiement, échanges - les réponses courantes.",
		href: "/faq",
		cta: "Voir la FAQ",
	},
] as const;
