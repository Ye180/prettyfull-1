import { eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import * as t from "../schema/index.js";

/**
 * Commandes de démonstration (§2.4).
 *
 * Chaque commande est construite comme le ferait le service métier :
 * instantané complet des libellés et prix, décrémentation du stock au niveau
 * le plus fin, mouvement de stock associé, historique de statuts et
 * transaction de paiement. Le tableau de bord et l'écran commandes du panel
 * ont ainsi des données cohérentes dès le premier lancement.
 */

interface SeedOrdersArgs {
	adminId: string;
	customerId: string;
}

interface OrderLineSpec {
	productSlug: string;
	quantity: number;
}

interface OrderSpec {
	daysAgo: number;
	status: (typeof t.orderStatusEnum.enumValues)[number];
	paymentStatus: (typeof t.paymentStatusEnum.enumValues)[number];
	fulfillmentStatus: (typeof t.fulfillmentStatusEnum.enumValues)[number];
	providerKey: string;
	lines: OrderLineSpec[];
}

const SHIPPING_ADDRESS = {
	firstName: "Aminata",
	lastName: "Sow",
	address1: "Rue des Jardins, Cocody",
	address2: null,
	company: null,
	city: "Abidjan",
	postalCode: null,
	province: null,
	countryCode: "ci",
	phone: "+225 07 00 00 01",
};

const ORDER_SPECS: OrderSpec[] = [
	{
		daysAgo: 14,
		status: "delivered",
		paymentStatus: "paid",
		fulfillmentStatus: "delivered",
		providerKey: "manual",
		lines: [
			{ productSlug: "robe-cocktail-satinee", quantity: 1 },
			{ productSlug: "top-en-soie", quantity: 2 },
		],
	},
	{
		daysAgo: 5,
		status: "shipped",
		paymentStatus: "paid",
		fulfillmentStatus: "shipped",
		providerKey: "manual",
		lines: [{ productSlug: "ensemble-tailleur", quantity: 1 }],
	},
	{
		daysAgo: 1,
		status: "pending_payment",
		paymentStatus: "pending",
		fulfillmentStatus: "not_fulfilled",
		providerKey: "wave",
		lines: [
			{ productSlug: "blazer-structure", quantity: 1 },
			{ productSlug: "boucles-oreilles-dorees", quantity: 1 },
		],
	},
];

/**
 * Choisit le point de stock à débiter pour un produit : le premier disponible
 * dans l'ordre variante/taille, en ignorant ceux déjà à zéro.
 */
const pickInventoryItem = async (productSlug: string) => {
	const rows = await db
		.select({
			inventoryItemId: t.inventoryItems.id,
			stockQuantity: t.inventoryItems.quantity,
			productId: t.products.id,
			productName: t.products.name,
			productSlug: t.products.slug,
			basePrice: t.products.basePrice,
			variantId: t.productVariants.id,
			variantName: t.productVariants.name,
			variantPrice: t.productVariants.priceOverride,
			sizeId: t.sizes.id,
			sizeLabel: t.sizes.label,
			sizePrice: t.sizes.priceOverride,
			sku: sql<string | null>`coalesce(${t.sizes.sku}, ${t.productVariants.sku}, ${t.products.sku})`,
			thumbnail: sql<string | null>`(
				select ${t.productImages.url}
				from ${t.productImages}
				where ${t.productImages.productId} = ${t.products.id}
				order by ${t.productImages.position}
				limit 1
			)`,
		})
		.from(t.inventoryItems)
		.innerJoin(t.products, eq(t.products.id, t.inventoryItems.productId))
		.leftJoin(t.productVariants, eq(t.productVariants.id, t.inventoryItems.variantId))
		.leftJoin(t.sizes, eq(t.sizes.id, t.inventoryItems.sizeId))
		.where(eq(t.products.slug, productSlug));

	return rows.find((row) => row.stockQuantity > 0) ?? rows[0];
};

export const seedOrders = async ({
	adminId,
	customerId,
}: SeedOrdersArgs): Promise<void> => {
	const [rate] = await db
		.select({
			id: t.shippingRates.id,
			name: t.shippingRates.name,
			amount: t.shippingRates.amount,
			providerKey: t.shippingRates.providerKey,
		})
		.from(t.shippingRates)
		.limit(1);

	let created = 0;

	for (const spec of ORDER_SPECS) {
		const placedAt = new Date();
		placedAt.setDate(placedAt.getDate() - spec.daysAgo);

		const lines = [];
		for (const line of spec.lines) {
			const item = await pickInventoryItem(line.productSlug);
			if (!item) continue;

			// Le prix effectif suit la cascade taille → variante → produit.
			const unitPrice = item.sizePrice ?? item.variantPrice ?? item.basePrice;
			lines.push({ ...item, quantity: line.quantity, unitPrice });
		}

		if (lines.length === 0) continue;

		const subtotal = lines.reduce(
			(total, line) => total + line.unitPrice * line.quantity,
			0,
		);
		const shippingTotal = rate?.amount ?? 0;
		const total = subtotal + shippingTotal;

		const [order] = await db
			.insert(t.orders)
			.values({
				userId: customerId,
				email: "cliente@prettyfull.shop",
				phone: SHIPPING_ADDRESS.phone,
				status: spec.status,
				paymentStatus: spec.paymentStatus,
				fulfillmentStatus: spec.fulfillmentStatus,
				currency: "xof",
				shippingAddress: SHIPPING_ADDRESS,
				billingAddress: SHIPPING_ADDRESS,
				shippingMethod: rate
					? {
							rateId: rate.id,
							providerKey: rate.providerKey,
							name: rate.name,
							amount: rate.amount,
						}
					: null,
				trackingNumber: spec.fulfillmentStatus === "shipped" ? "PF-CI-004921" : null,
				carrier: spec.fulfillmentStatus === "shipped" ? "Livraison PrettyFull" : null,
				subtotal,
				shippingTotal,
				taxTotal: 0,
				discountTotal: 0,
				total,
				placedAt,
				paidAt: spec.paymentStatus === "paid" ? placedAt : null,
				shippedAt: spec.fulfillmentStatus !== "not_fulfilled" ? placedAt : null,
				deliveredAt: spec.fulfillmentStatus === "delivered" ? placedAt : null,
				createdAt: placedAt,
				updatedAt: placedAt,
			})
			.returning({ id: t.orders.id });

		const orderId = order!.id;

		await db.insert(t.orderItems).values(
			lines.map((line) => ({
				orderId,
				productId: line.productId,
				variantId: line.variantId,
				sizeId: line.sizeId,
				inventoryItemId: line.inventoryItemId,
				productName: line.productName,
				productSlug: line.productSlug,
				variantName: line.variantName,
				sizeLabel: line.sizeLabel,
				sku: line.sku,
				thumbnail: line.thumbnail,
				unitPrice: line.unitPrice,
				quantity: line.quantity,
				lineTotal: line.unitPrice * line.quantity,
				createdAt: placedAt,
			})),
		);

		// Une commande payée a consommé son stock ; une commande en attente de
		// paiement ne l'a que réservé (§2.3, règle retenue).
		if (spec.paymentStatus === "paid") {
			for (const line of lines) {
				// Le stock est relu avant écriture : un même point de stock peut
				// apparaître dans plusieurs commandes du jeu de démonstration.
				const [current] = await db
					.select({ quantity: t.inventoryItems.quantity })
					.from(t.inventoryItems)
					.where(eq(t.inventoryItems.id, line.inventoryItemId));

				const quantityBefore = current?.quantity ?? 0;
				const quantityAfter = Math.max(0, quantityBefore - line.quantity);
				if (quantityAfter === quantityBefore) continue;

				await db
					.update(t.inventoryItems)
					.set({ quantity: quantityAfter, updatedAt: placedAt })
					.where(eq(t.inventoryItems.id, line.inventoryItemId));

				await db.insert(t.stockMovements).values({
					inventoryItemId: line.inventoryItemId,
					direction: "out",
					quantity: quantityBefore - quantityAfter,
					quantityBefore,
					quantityAfter,
					reason: "order_confirmed",
					note: "Commande payée (jeu de démonstration)",
					orderId,
					createdAt: placedAt,
				});
			}
		}

		await db.insert(t.orderStatusHistory).values({
			orderId,
			fromStatus: null,
			toStatus: spec.status,
			comment: "Commande du jeu de démonstration",
			userId: adminId,
			userLabel: "Awa Koné",
			createdAt: placedAt,
		});

		await db.insert(t.transactions).values({
			orderId,
			providerKey: spec.providerKey,
			providerTransactionId: `demo_${orderId.slice(0, 8)}`,
			kind: "payment",
			status: spec.paymentStatus === "paid" ? "success" : "pending",
			amount: total,
			currency: "xof",
			createdAt: placedAt,
			updatedAt: placedAt,
		});

		created += 1;
	}

	console.log(`  commandes : ${created} commandes de démonstration`);
};
