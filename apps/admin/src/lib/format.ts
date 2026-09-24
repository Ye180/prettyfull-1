import {
	CURRENCY_EXPONENTS,
	type CurrencyCode,
	type OrderStatus,
	type PaymentStatus,
	type StockStatus,
} from "@prettyfull/contracts";

/**
 * Formatage d'affichage du panel.
 *
 * Les montants circulent en entiers (plus petite unité) de bout en bout ;
 * la conversion en unité principale n'a lieu qu'ici, au moment du rendu.
 */

export const formatMoney = (amount: number, currency: CurrencyCode): string =>
	new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: currency.toUpperCase(),
		minimumFractionDigits: CURRENCY_EXPONENTS[currency],
		maximumFractionDigits: CURRENCY_EXPONENTS[currency],
	}).format(amount / 10 ** CURRENCY_EXPONENTS[currency]);

/** Saisie admin (« 12 500 ») vers entier en plus petite unité. */
export const parseMoney = (value: string, currency: CurrencyCode): number => {
	const normalized = value.replace(/\s/g, "").replace(",", ".");
	const parsed = Number.parseFloat(normalized);
	if (!Number.isFinite(parsed)) return 0;
	return Math.round(parsed * 10 ** CURRENCY_EXPONENTS[currency]);
};

/** Entier en plus petite unité vers une valeur éditable dans un champ. */
export const moneyToInput = (amount: number, currency: CurrencyCode): string =>
	String(amount / 10 ** CURRENCY_EXPONENTS[currency]);

export const formatDate = (iso: string): string =>
	new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(iso));

export const formatDateTime = (iso: string): string =>
	new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(iso));

/** Date relative courte (« il y a 3 h »), pour les listes d'activité. */
export const formatRelative = (iso: string): string => {
	const diffSeconds = (Date.now() - new Date(iso).getTime()) / 1000;
	const formatter = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

	const units: [Intl.RelativeTimeFormatUnit, number][] = [
		["year", 31_536_000],
		["month", 2_592_000],
		["day", 86_400],
		["hour", 3_600],
		["minute", 60],
	];

	for (const [unit, seconds] of units) {
		if (Math.abs(diffSeconds) >= seconds) {
			return formatter.format(-Math.round(diffSeconds / seconds), unit);
		}
	}

	return "à l'instant";
};

export const formatNumber = (value: number): string =>
	new Intl.NumberFormat("fr-FR").format(value);

export const formatPercent = (value: number | null): string =>
	value === null ? "-" : `${value > 0 ? "+" : ""}${value.toFixed(1)} %`;

// --- Libellés métier -------------------------------------------------------

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	pending_payment: "En attente de paiement",
	paid: "Payée",
	preparing: "En préparation",
	shipped: "Expédiée",
	delivered: "Livrée",
	cancelled: "Annulée",
	refunded: "Remboursée",
	disputed: "Litige",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
	pending: "En attente",
	authorized: "Autorisé",
	paid: "Payé",
	failed: "Échoué",
	partially_refunded: "Partiellement remboursé",
	refunded: "Remboursé",
	cancelled: "Annulé",
};

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
	in_stock: "En stock",
	low_stock: "Stock faible",
	out_of_stock: "Rupture",
};

export const STOCK_REASON_LABELS: Record<string, string> = {
	order_reserved: "Réservé (commande)",
	order_confirmed: "Vendu (commande)",
	order_cancelled: "Commande annulée",
	order_refunded: "Remboursement",
	reservation_expired: "Réservation expirée",
	supplier_receipt: "Réception fournisseur",
	damage: "Casse",
	inventory_count: "Inventaire",
	correction: "Correction d'erreur",
	manual_restock: "Réapprovisionnement",
};

export const CONTENT_STATUS_LABELS: Record<string, string> = {
	draft: "Brouillon",
	published: "Publié",
	archived: "Archivé",
};

export const BANNER_PLACEMENT_LABELS: Record<string, string> = {
	home_hero: "Accueil - bandeau principal",
	home_secondary: "Accueil - bandeau secondaire",
	home_promo: "Accueil - promotion",
	collection_top: "Collections - bandeau principal",
	collection_promo: "Collections - cartes promo",
	collection_footer: "Collections - bandeau bas de page",
	sidebar: "Colonne latérale",
};
