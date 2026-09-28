type Translate = (
	key: string,
	values?: Record<string, string | number | Date>,
) => string;

export const FAQ_CATEGORY_KEYS = [
	"orders",
	"shipping",
	"returns",
	"products",
	"payments",
	"account",
] as const;

export type FaqCategoryKey = (typeof FAQ_CATEGORY_KEYS)[number];

export interface FaqItem {
	title: string;
	description: string;
	category: FaqCategoryKey;
}

export const getFaqCategoryLabel = (t: Translate, category: FaqCategoryKey) =>
	t(`categories.${category}`);

const ITEM_CATEGORIES: FaqCategoryKey[] = [
	"orders",
	"orders",
	"orders",
	"shipping",
	"shipping",
	"returns",
	"returns",
	"returns",
	"returns",
	"returns",
	"products",
	"products",
	"payments",
	"payments",
	"account",
	"account",
];

// Ordre synchronisé avec ITEM_CATEGORIES et les clés items.itemN.* du namespace FaqPage
export const getFaqItems = (t: Translate): FaqItem[] =>
	ITEM_CATEGORIES.map((category, index) => ({
		title: t(`items.item${index + 1}.title`),
		description: t(`items.item${index + 1}.description`),
		category,
	}));
