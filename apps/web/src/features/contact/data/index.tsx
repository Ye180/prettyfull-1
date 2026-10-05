import { CONTACT_INFO } from "@/lib/utils/constants/contact";

/**
 * Coordonnées et contenu de la page contact.
 *
 * Centralisés ici : ces informations changent (horaires, numéro) sans que la
 * mise en page ait à bouger. Le texte affiché passe par `next-intl`
 * (namespace "ContactPage") ; seules les données non traduisibles (e-mail,
 * numéro, liens) restent des constantes statiques.
 */

type Translate = (key: string) => string;

export const getContactDetails = (t: Translate) =>
	({
		...CONTACT_INFO,
		address: {
			line1: t("address.line1"),
			city: t("address.city"),
			country: t("address.country"),
		},
		hours: [
			{ days: t("hours.weekdays"), time: t("hours.weekdaysTime") },
			{ days: t("hours.saturday"), time: t("hours.saturdayTime") },
			{ days: t("hours.sunday"), time: t("hours.sundayTime") },
		],
	}) as const;

/** Sujets proposés : ils orientent le message et accélèrent le tri côté panel. */
export const getSubjects = (t: Translate) =>
	[
		t("subjects.subject1"),
		t("subjects.subject2"),
		t("subjects.subject3"),
		t("subjects.subject4"),
		t("subjects.subject5"),
		t("subjects.subject6"),
	] as const;

/**
 * Raccourcis vers les réponses déjà écrites.
 *
 * Placés à côté du formulaire, pas après : une question dont la réponse est
 * publiée n'a pas besoin de passer par un message.
 */
export const getShortcuts = (t: Translate) =>
	[
		{
			title: t("shortcuts.shortcut1.title"),
			description: t("shortcuts.shortcut1.description"),
			href: "/account/orders",
			cta: t("shortcuts.shortcut1.cta"),
		},
		{
			title: t("shortcuts.shortcut2.title"),
			description: t("shortcuts.shortcut2.description"),
			href: "/shipping-return",
			cta: t("shortcuts.shortcut2.cta"),
		},
		{
			title: t("shortcuts.shortcut3.title"),
			description: t("shortcuts.shortcut3.description"),
			href: "/faq",
			cta: t("shortcuts.shortcut3.cta"),
		},
	] as const;
