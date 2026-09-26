/**
 * Contenu éditorial de la page « À propos ».
 *
 * Séparé des composants : le texte d'une page de marque change souvent, la
 * mise en page presque jamais. Les visuels référencent `apps/web/public`.
 */

export const HERO = {
	image: "/home/supplements-hero-lifestyle.jpg",
	eyebrow: "Abidjan, Côte d'Ivoire",
	title: "Votre santé, une routine à la fois",
	lead: "PrettyFull sélectionne des vitamines et compléments testés en laboratoire indépendant : des ingrédients de qualité, des dosages exacts, et des formules pensées pour s'intégrer simplement à votre quotidien.",
} as const;

export const STORY = {
	image: "/home/supplements-hero-flatlay.jpg",
	title: "Ce qui nous a mises en route",
	paragraphs: [
		"Nous avons commencé par un constat simple : entre les compléments bas de gamme aux dosages flous et les marques importées hors de prix, il ne restait pas grand-chose pour qui veut prendre soin de sa santé sans y laisser sa confiance.",
		"Alors nous avons pris le problème par l'étiquette. Chaque référence est vérifiée en laboratoire indépendant avant d'entrer au catalogue. Celles qui ne passent pas ce test n'y entrent jamais.",
		"Aujourd'hui, PrettyFull livre depuis Abidjan dans toute l'Afrique de l'Ouest - et l'exigence n'a pas bougé.",
	],
} as const;

export const VALUES = [
	{
		number: "01",
		title: "Sélectionner, pas empiler",
		description:
			"Une nouveauté n'arrive que si elle mérite sa place. Nous préférons un catalogue court et de confiance à un catalogue infini où l'on se perd.",
	},
	{
		number: "02",
		title: "L'ingrédient avant l'étiquette",
		description:
			"La pureté, le dosage exact, la provenance des actifs. Ce sont ces détails qui font qu'un complément tient ses promesses.",
	},
	{
		number: "03",
		title: "Des lots courts, toujours frais",
		description:
			"Nous commandons peu, et nous réassortissons ce qui plaît. C'est moins confortable pour nous, mais cela évite les stocks qui dorment et perdent en efficacité.",
	},
	{
		number: "04",
		title: "Une adresse, pas un formulaire",
		description:
			"Une question sur un dosage, un retour, un colis en retard : vous parlez à quelqu'un qui connaît le produit et qui peut décider.",
	},
] as const;

export const NUMBERS = [
	{ value: "48 h", label: "Livraison à Abidjan" },
	{ value: "14 j", label: "Pour changer d'avis" },
	{ value: "6", label: "Pays desservis" },
	{ value: "100 %", label: "Lots testés en laboratoire" },
] as const;

export const GALLERY = [
	{ src: "/products/multivitamin.jpg", alt: "Complément multivitamine de la gamme" },
	{ src: "/products/protein-powder.jpg", alt: "Protéine en poudre de la gamme" },
	{ src: "/category/category-wellness.jpg", alt: "Ingrédients naturels sélectionnés" },
	{ src: "/products/gummies.jpg", alt: "Vitamines en gommes de la nouvelle gamme" },
] as const;

export const COMMITMENTS = [
	{
		title: "Testé avant d'être vendu",
		description:
			"Chaque référence passe en laboratoire indépendant : pureté, dosage, sécurité. Si le contrôle ne passe pas, elle ne sort pas.",
	},
	{
		title: "Le prix juste, affiché",
		description:
			"Pas de prix barré permanent ni de fausse promotion. Quand une référence est en solde, c'est qu'elle l'est vraiment.",
	},
	{
		title: "Retour sans discussion",
		description:
			"Quatorze jours pour changer d'avis, non ouvert et dans son emballage. Sans avoir à se justifier.",
	},
] as const;
