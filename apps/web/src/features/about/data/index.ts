/**
 * Contenu éditorial de la page « À propos ».
 *
 * Séparé des composants : le texte d'une page de marque change souvent, la
 * mise en page presque jamais. Les visuels référencent `apps/web/public`.
 */

export const HERO = {
	image: "/home/commerce.jpg",
	eyebrow: "Abidjan, Côte d'Ivoire",
	title: "Une garde-robe choisie, pas subie",
	lead: "PrettyFull réunit des pièces féminines sélectionnées une à une : des matières agréables, des coupes qui tiennent dans le temps, et des quantités volontairement limitées.",
} as const;

export const STORY = {
	image: "/home/presentation.jpg",
	title: "Ce qui nous a mises en route",
	paragraphs: [
		"Nous avons commencé par un constat simple : entre la fast fashion qui se déforme au troisième lavage et le luxe inaccessible, il ne restait pas grand-chose pour une femme qui veut s'habiller bien sans y passer ses journées.",
		"Alors nous avons pris le problème par le bout du tissu. Chaque pièce est essayée, portée, lavée avant d'entrer au catalogue. Celles qui ne passent pas ce test n'y entrent jamais.",
		"Aujourd'hui, PrettyFull livre depuis Abidjan dans toute l'Afrique de l'Ouest - et l'exigence n'a pas bougé.",
	],
} as const;

export const VALUES = [
	{
		number: "01",
		title: "Sélectionner, pas empiler",
		description:
			"Une nouveauté n'arrive que si elle mérite sa place. Nous préférons un catalogue court que vous pouvez parcourir en entier à un catalogue infini où l'on se perd.",
	},
	{
		number: "02",
		title: "La matière avant l'étiquette",
		description:
			"Le tombé, la tenue au lavage, la façon dont un vêtement vieillit. Ce sont ces détails qui font qu'on garde une pièce trois ans plutôt qu'une saison.",
	},
	{
		number: "03",
		title: "Des séries courtes",
		description:
			"Nous commandons peu, et nous réassortissons ce qui plaît. C'est moins confortable pour nous, mais cela évite les montagnes d'invendus bradés en fin de saison.",
	},
	{
		number: "04",
		title: "Une adresse, pas un formulaire",
		description:
			"Une question sur une taille, un retour, un colis en retard : vous parlez à quelqu'un qui connaît le produit et qui peut décider.",
	},
] as const;

export const NUMBERS = [
	{ value: "48 h", label: "Livraison à Abidjan" },
	{ value: "14 j", label: "Pour changer d'avis" },
	{ value: "6", label: "Pays desservis" },
	{ value: "100 %", label: "Pièces testées avant vente" },
] as const;

export const GALLERY = [
	{ src: "/home/arrivals-1.jpg", alt: "Ensemble coordonné de la collection" },
	{ src: "/home/arrivals-2.jpg", alt: "Pièce de la collection en situation" },
	{ src: "/home/cover-box-second-3.jpg", alt: "Détail de matière" },
	{ src: "/home/arrivals-3.jpg", alt: "Silhouette de la nouvelle collection" },
] as const;

export const COMMITMENTS = [
	{
		title: "Essayé avant d'être vendu",
		description:
			"Chaque référence passe entre nos mains : porté, lavé, jugé. Si la coupe ne tient pas, elle ne sort pas.",
	},
	{
		title: "Le prix juste, affiché",
		description:
			"Pas de prix barré permanent ni de fausse promotion. Quand une pièce est en solde, c'est qu'elle l'est vraiment.",
	},
	{
		title: "Retour sans discussion",
		description:
			"Quatorze jours pour changer d'avis, non porté et dans son emballage. Sans avoir à se justifier.",
	},
] as const;
