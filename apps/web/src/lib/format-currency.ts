/**
 * Format an amount in a given ISO currency code using Intl.NumberFormat.
 * Generic on purpose: not tied to Medusa, collections, or any locale — pass
 * a BCP 47 locale (e.g. from next-intl's `useLocale()`) if you need one.
 */
export function formatCurrency(
	amount: number,
	currencyCode: string,
	locale = "en-US",
) {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currencyCode,
	}).format(amount);
}
