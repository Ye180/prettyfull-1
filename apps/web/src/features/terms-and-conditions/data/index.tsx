type Translate = (key: string) => string;

const ITEM_KEYS = [
	"purpose",
	"products",
	"prices",
	"payment",
	"orderValidation",
	"delivery",
	"withdrawal",
	"returns",
	"warranty",
	"personalData",
	"intellectualProperty",
	"liability",
	"healthWarnings",
	"jurisdiction",
] as const;

export const getTermsItems = (t: Translate) =>
	ITEM_KEYS.map((key) => ({
		title: t(`items.${key}.title`),
		description: t(`items.${key}.description`),
	}));
