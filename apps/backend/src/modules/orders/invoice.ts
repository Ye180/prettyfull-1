import { formatMoney, type Order } from "@prettyfull/contracts";
import { getStoreSettings } from "../settings/service.js";

/**
 * Facture au format HTML (§2.4).
 *
 * Rendue en HTML plutôt qu'en PDF binaire : le navigateur sait l'imprimer en
 * PDF via `@media print`, ce qui évite d'embarquer un moteur de rendu PDF et
 * ses polices dans l'image de déploiement, pour un résultat identique.
 */

/** Neutralise le HTML des données saisies : une facture ne doit rien exécuter. */
const escape = (value: unknown): string =>
	String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

const formatDate = (iso: string): string =>
	new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(iso));

export const renderInvoice = async (order: Order): Promise<string> => {
	const settings = await getStoreSettings();
	const money = (amount: number) => formatMoney(amount, order.currency);
	const reference = `${settings.orderNumberPrefix}-${order.displayId}`;

	const address = order.billingAddress ?? order.shippingAddress;

	const addressLines = [
		`${address.firstName ?? ""} ${address.lastName ?? ""}`.trim(),
		address.company,
		address.address1,
		address.address2,
		[address.postalCode, address.city].filter(Boolean).join(" "),
		address.countryCode?.toUpperCase(),
		address.phone,
	]
		.filter(Boolean)
		.map((line) => `<div>${escape(line)}</div>`)
		.join("");

	const rows = order.items
		.map(
			(item) => `
			<tr>
				<td>
					<strong>${escape(item.productName)}</strong>
					${
						item.variantName || item.sizeLabel
							? `<div class="muted">${escape(
									[item.variantName, item.sizeLabel].filter(Boolean).join(" · "),
								)}</div>`
							: ""
					}
					${item.sku ? `<div class="muted">SKU ${escape(item.sku)}</div>` : ""}
				</td>
				<td class="num">${money(item.unitPrice)}</td>
				<td class="num">${item.quantity}</td>
				<td class="num">${money(item.lineTotal)}</td>
			</tr>`,
		)
		.join("");

	return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Facture ${escape(reference)}</title>
<style>
	:root { color-scheme: light; }
	* { box-sizing: border-box; }
	body {
		font: 14px/1.55 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
		color: #1a1a1a; background: #fff; margin: 0; padding: 40px;
	}
	.sheet { max-width: 760px; margin: 0 auto; }
	header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
	h1 { font-size: 22px; margin: 0 0 4px; letter-spacing: -0.01em; }
	.muted { color: #6b6b6b; font-size: 12px; }
	.brand { font-size: 20px; font-weight: 700; letter-spacing: -0.02em; }
	.grid { display: flex; gap: 48px; margin: 32px 0; }
	.grid section { flex: 1; }
	h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6b6b; margin: 0 0 8px; }
	table { width: 100%; border-collapse: collapse; margin-top: 8px; }
	th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
	     color: #6b6b6b; border-bottom: 1px solid #e3e3e3; padding: 8px 0; font-weight: 600; }
	td { padding: 12px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
	.num { text-align: right; white-space: nowrap; }
	tfoot td { border: none; padding: 6px 0; }
	tfoot .total td { border-top: 2px solid #1a1a1a; font-weight: 700; font-size: 16px; padding-top: 12px; }
	footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e3e3e3; }
	/* L'impression navigateur produit le PDF : pas de marges parasites. */
	@media print { body { padding: 0; } @page { margin: 18mm; } }
</style>
</head>
<body>
<div class="sheet">
	<header>
		<div>
			<div class="brand">${escape(settings.storeName)}</div>
			<div class="muted">${escape(settings.contactEmail)}</div>
			${settings.supportPhone ? `<div class="muted">${escape(settings.supportPhone)}</div>` : ""}
		</div>
		<div style="text-align:right">
			<h1>Facture ${escape(reference)}</h1>
			<div class="muted">Émise le ${escape(formatDate(order.placedAt))}</div>
			${order.paidAt ? `<div class="muted">Payée le ${escape(formatDate(order.paidAt))}</div>` : ""}
		</div>
	</header>

	<div class="grid">
		<section>
			<h2>Facturé à</h2>
			${addressLines}
			<div class="muted" style="margin-top:6px">${escape(order.email)}</div>
		</section>
		<section>
			<h2>Livraison</h2>
			<div>${escape(order.shippingMethod?.name ?? "-")}</div>
			${order.trackingNumber ? `<div class="muted">Suivi ${escape(order.trackingNumber)}</div>` : ""}
			${order.carrier ? `<div class="muted">${escape(order.carrier)}</div>` : ""}
		</section>
	</div>

	<table>
		<thead>
			<tr>
				<th>Article</th>
				<th class="num">Prix unitaire</th>
				<th class="num">Qté</th>
				<th class="num">Total</th>
			</tr>
		</thead>
		<tbody>${rows}</tbody>
		<tfoot>
			<tr><td colspan="3" class="num muted">Sous-total</td><td class="num">${money(order.subtotal)}</td></tr>
			<tr><td colspan="3" class="num muted">Livraison</td><td class="num">${money(order.shippingTotal)}</td></tr>
			${order.taxTotal > 0 ? `<tr><td colspan="3" class="num muted">Taxes</td><td class="num">${money(order.taxTotal)}</td></tr>` : ""}
			${order.discountTotal > 0 ? `<tr><td colspan="3" class="num muted">Remise</td><td class="num">− ${money(order.discountTotal)}</td></tr>` : ""}
			<tr class="total"><td colspan="3" class="num">Total</td><td class="num">${money(order.total)}</td></tr>
			${order.refundedTotal > 0 ? `<tr><td colspan="3" class="num muted">Remboursé</td><td class="num">− ${money(order.refundedTotal)}</td></tr>` : ""}
		</tfoot>
	</table>

	<footer class="muted">
		Prix exprimés en ${escape(order.currency.toUpperCase())}, toutes taxes comprises.
		${order.note ? `<div style="margin-top:8px">${escape(order.note)}</div>` : ""}
	</footer>
</div>
</body>
</html>`;
};
