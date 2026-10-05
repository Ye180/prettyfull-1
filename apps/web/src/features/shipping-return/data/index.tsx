type Translate = (key: string) => string;

const ITEM_KEYS = [
	"zones",
	"delays",
	"fees",
	"tracking",
	"damagedParcel",
	"iphones",
	"returnWindow",
	"returnConditions",
	"refund",
	"nonReturnable",
	"exchange",
] as const;

export const getShippingReturnItems = (t: Translate) =>
	ITEM_KEYS.map((key) => ({
		id: key,
		title: t(`items.${key}.title`),
		description: t(`items.${key}.description`),
	}));
