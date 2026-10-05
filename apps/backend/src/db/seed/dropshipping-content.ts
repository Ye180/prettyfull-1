import { closeDb } from "../index.js";
import { getCategoryBySlug, updateCategory } from "../../modules/catalog/categories.service.js";
import {
	listBanners,
	listContentHighlights,
	updateBanner,
	updateContentHighlight,
} from "../../modules/cms/service.js";

/**
 * Contenu éditorial de l'accueil et des pages collection après la bascule
 * dropshipping (cf. dropshipping-catalog.ts) : bannières, blocs de
 * confiance, descriptions des rayons. Tout reste modifiable depuis
 * Admin > Contenu et Admin > Catalogue > Catégories. Rejouable.
 */

const img = (name: string) => `/products/shop/${name}.jpg`;

/** Mis à jour dans l'ordre où l'admin les liste (emplacement puis position). */
const BANNERS: Record<string, { title: string; subtitle: string; image: string; cta: string | null; link: string }[]> = {
	home_hero: [
		{
			title: "Le meilleur des USA, livré chez vous",
			subtitle:
				"iPhone neufs et de seconde main, soins visage et corps, parfums, mode et épicerie américaine : une sélection importée, livrée à Abidjan.",
			image: img("hero-shopping-alt"),
			cta: "Découvrir la boutique",
			link: "/collections",
		},
	],
	home_secondary: [
		{
			title: "L'iPhone qu'il vous faut",
			subtitle: "Neuf et scellé ou de seconde main, de l'iPhone X au dernier modèle.",
			image: img("iphone-pro"),
			cta: null,
			link: "/collections/iphone",
		},
	],
	home_promo: [
		{
			title: "Des soins Made in USA",
			subtitle:
				"Crèmes, sérums, gels douche et huiles, éclaircissants, hydratants, nourrissants ou clarifiants, pour le visage comme pour le corps.",
			image: img("beauty-flatlay-alt"),
			cta: "Découvrir les soins",
			link: "/collections/soins-visage",
		},
	],
	collection_top: [
		{
			title: "Toute la boutique",
			subtitle: "iPhone, soins, parfums, mode et épicerie américaine, réunis au même endroit.",
			image: img("hero-shopping"),
			cta: "Achetez maintenant",
			link: "#catalog-grid",
		},
	],
	collection_promo: [
		{
			title: "iPhone de seconde main",
			subtitle: "De l'iPhone X à l'iPhone 16 Pro Max, en bon état, comme neufs.",
			image: img("iphone-used"),
			cta: "Voir les iPhone",
			link: "/collections/iphone-seconde-main",
		},
		{
			title: "Mode & Accessoires",
			subtitle: "Lululemon, Alo, sacs Coach New York et valises de voyage.",
			image: img("handbag"),
			cta: "Explorer",
			link: "/collections/mode-accessoires",
		},
	],
	collection_footer: [
		{
			title: "Prêt à passer commande ?",
			subtitle: "Une question sur un produit ou une commande ? Notre équipe vous répond.",
			image: img("suitcase"),
			cta: "Découvrir la boutique",
			link: "/collections",
		},
	],
};

const HIGHLIGHTS = [
	{
		icon: "shield",
		title: "Produits authentiques",
		description: "Chaque article est sourcé auprès de fournisseurs aux USA, neuf ou de seconde main.",
	},
	{
		icon: "truck",
		title: "Livré jusqu'à chez vous",
		description: "Vous commandez en ligne, nous nous occupons de l'import et de la livraison à Abidjan.",
	},
	{
		icon: "lab",
		title: "Un service à l'écoute",
		description: "Une question sur un produit, un modèle ou une taille ? Notre équipe vous répond.",
	},
];

const FEATURED = new Set(["iphone-neuf", "serums-visage", "sacs", "parfums", "cremes-corps"]);

const DESCRIPTIONS: Record<string, [fr: string, en: string]> = {
	"soins-visage": ["Crèmes et sérums visage fabriqués aux USA : éclaircissants, hydratants, nourrissants ou clarifiants.", "US-made face creams and serums: brightening, hydrating, nourishing or clarifying."],
	"cremes-visage": ["Crèmes visage Made in USA, pour chaque type de peau.", "US-made face creams for every skin type."],
	"serums-visage": ["Sérums visage concentrés, fabriqués aux USA.", "Concentrated US-made face serums."],
	"soins-corps": ["Crèmes, gels douche et huiles pour le corps, fabriqués aux USA.", "US-made body creams, shower gels and body oils."],
	"cremes-corps": ["Crèmes pour le corps éclaircissantes, hydratantes, nourrissantes ou clarifiantes.", "Brightening, hydrating, nourishing or clarifying body creams."],
	"gels-douche": ["Gels douche Made in USA, du quotidien au soin ciblé.", "US-made shower gels, from everyday to targeted care."],
	"huiles-corps": ["Huiles pour le corps qui laissent la peau douce et souple.", "Body oils that leave skin soft and supple."],
	"telephones-informatique": ["iPhone neufs et scellés ou de seconde main, et ordinateurs importés des USA.", "New sealed and pre-owned iPhones, plus computers imported from the US."],
	iphone: ["Du dernier modèle scellé à l'iPhone de seconde main en bon état.", "From the latest sealed model to pre-owned iPhones in good condition."],
	"iphone-neuf": ["iPhone neufs, scellés dans leur emballage d'origine.", "New iPhones, sealed in their original packaging."],
	"iphone-seconde-main": ["De l'iPhone X à l'iPhone 16 Pro Max, en bon état, comme neufs.", "From iPhone X to iPhone 16 Pro Max, in good, like-new condition."],
	ordinateurs: ["Ordinateurs portables importés des USA, configuration sur demande.", "Laptops imported from the US, configuration on request."],
	"hygiene-bucco-dentaire": ["Dentifrices Colgate, Crest, Sensodyne et TheraBreath, bains de bouche et blanchiment.", "Colgate, Crest, Sensodyne and TheraBreath toothpaste, mouthwash and whitening."],
	dentifrices: ["Colgate, Crest, Sensodyne et TheraBreath, importés des USA.", "Colgate, Crest, Sensodyne and TheraBreath, imported from the US."],
	"blanchiment-dents": ["Kits de blanchiment dentaire à utiliser chez soi.", "At-home teeth whitening kits."],
	"bains-de-bouche": ["Bains de bouche TheraBreath pour une haleine fraîche.", "TheraBreath mouthwash for fresh breath."],
	parfums: ["Parfums importés des USA, fragrance au choix.", "Fragrances imported from the US, scent of your choice."],
	cheveux: ["Raw hair : cheveux naturels non transformés, Made in USA.", "Raw hair: unprocessed natural hair, made in the USA."],
	"raw-hair": ["Cheveux naturels non transformés, longueur et texture sur demande.", "Unprocessed natural hair, length and texture on request."],
	"mode-accessoires": ["Vêtements Lululemon et Alo, sacs Coach New York et valises de voyage.", "Lululemon and Alo apparel, Coach New York bags and travel luggage."],
	vetements: ["Lululemon, Alo et autres marques américaines.", "Lululemon, Alo and other US brands."],
	sacs: ["Sacs Coach New York et autres marques.", "Coach New York and other brand bags."],
	"valises-voyage": ["Valises de voyage, taille et coloris sur demande.", "Travel suitcases, size and color on request."],
	"epicerie-americaine": ["Épices et biscuits américains, comme là-bas.", "American spices and cookies, just like over there."],
	"epices-americaines": ["Épices et assaisonnements importés des USA.", "Spices and seasonings imported from the US."],
	"biscuits-americains": ["Biscuits et cookies importés des USA.", "Cookies and biscuits imported from the US."],
};

const run = async () => {
	for (const [placement, contents] of Object.entries(BANNERS)) {
		const { data } = await listBanners({ page: 1, limit: 50, placement: placement as never });
		const sorted = [...data].sort((a, b) => a.position - b.position);
		for (const [index, banner] of sorted.entries()) {
			const content = contents[index];
			if (!content) continue;
			await updateBanner(banner.id, {
				title: content.title,
				subtitle: content.subtitle,
				imageUrl: content.image,
				mobileImageUrl: null,
				ctaLabel: content.cta,
				linkUrl: content.link,
			});
		}
		console.log(`  bannières ${placement} : ${Math.min(sorted.length, contents.length)} mise(s) à jour`);
	}

	const { data: highlights } = await listContentHighlights({ page: 1, limit: 50, sectionKey: "home_trust" });
	const sortedHighlights = [...highlights].sort((a, b) => a.position - b.position);
	for (const [index, highlight] of sortedHighlights.entries()) {
		const content = HIGHLIGHTS[index];
		if (content) await updateContentHighlight(highlight.id, content);
	}
	console.log(`  blocs home_trust : ${Math.min(sortedHighlights.length, HIGHLIGHTS.length)} mis à jour`);

	for (const [slug, [fr, en]] of Object.entries(DESCRIPTIONS)) {
		const category = await getCategoryBySlug(slug);
		await updateCategory(category.id, {
			description: fr,
			isFeatured: FEATURED.has(slug),
			translations: {
				...category.translations,
				en: { ...category.translations?.en, description: en },
			},
		});
	}
	console.log(`  rayons : ${Object.keys(DESCRIPTIONS).length} descriptions mises à jour`);
};

run()
	.catch((error: unknown) => {
		console.error("échec :", error);
		process.exitCode = 1;
	})
	.finally(() => closeDb());
