import type { SizeInput, VariantInput } from "@prettyfull/contracts";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { conflict, invalidProductModel, notFound } from "../../lib/errors.js";
import { getProduct } from "./products.service.js";
import type { Product } from "@prettyfull/contracts";

/**
 * Gestion incrémentale des variantes et des tailles (§2.2).
 *
 * Ces routes sont l'autre porte d'entrée du modèle produit, à côté de la
 * création complète : chacune revérifie la règle de cohérence, car c'est
 * exactement par là qu'un produit hybride pourrait naître — ajouter une
 * variante à un produit simple, ou une taille de produit à un produit à
 * variantes.
 */

const loadProduct = async (productId: string): Promise<Product> => {
	const product = await getProduct(productId);
	if (product.archivedAt) {
		throw conflict("Ce produit est archivé. Restaurez-le avant de le modifier.");
	}
	return product;
};

// --- Variantes -------------------------------------------------------------

export const addVariant = async (
	productId: string,
	input: VariantInput,
): Promise<Product> => {
	const product = await loadProduct(productId);

	if (product.kind !== "variant") {
		throw invalidProductModel(
			"Ce produit est déclaré « simple » : il ne peut pas recevoir de variantes. Dupliquez-le en produit à variantes.",
		);
	}

	await db.transaction(async (tx) => {
		const [variant] = await tx
			.insert(t.productVariants)
			.values({
				productId,
				name: input.name,
				colorHex: input.colorHex ?? null,
				sku: input.sku ?? null,
				priceOverride: input.priceOverride ?? null,
				compareAtPriceOverride: input.compareAtPriceOverride ?? null,
				status: input.status,
				position: input.position ?? product.variants.length,
			})
			.returning({ id: t.productVariants.id });

		const variantId = variant!.id;

		if (input.images.length > 0) {
			await tx.insert(t.variantImages).values(
				input.images.map((image, index) => ({
					variantId,
					url: image.url,
					alt: image.alt ?? null,
					position: image.position ?? index,
				})),
			);
		}

		if (input.sizes.length > 0) {
			for (const [index, size] of input.sizes.entries()) {
				const [inserted] = await tx
					.insert(t.sizes)
					.values({
						variantId,
						label: size.label,
						sku: size.sku ?? null,
						priceOverride: size.priceOverride ?? null,
						position: size.position ?? index,
						status: size.status,
					})
					.returning({ id: t.sizes.id });

				await tx.insert(t.inventoryItems).values({
					productId,
					variantId,
					sizeId: inserted!.id,
					quantity: size.initialQuantity ?? 0,
					lowStockThreshold: size.lowStockThreshold ?? product.lowStockThreshold,
				});
			}
		} else {
			await tx.insert(t.inventoryItems).values({
				productId,
				variantId,
				quantity: input.initialQuantity ?? 0,
				lowStockThreshold: input.lowStockThreshold ?? product.lowStockThreshold,
			});
		}
	});

	return getProduct(productId);
};

export const updateVariant = async (
	productId: string,
	variantId: string,
	input: Partial<VariantInput>,
): Promise<Product> => {
	const [existing] = await db
		.select({ id: t.productVariants.id })
		.from(t.productVariants)
		.where(
			and(eq(t.productVariants.id, variantId), eq(t.productVariants.productId, productId)),
		)
		.limit(1);

	if (!existing) throw notFound("Variante");

	await db.transaction(async (tx) => {
		const { images, sizes: _sizes, initialQuantity: _q, lowStockThreshold: _l, ...fields } = input;

		const patch = Object.fromEntries(
			Object.entries(fields).filter(([, value]) => value !== undefined),
		);

		if (Object.keys(patch).length > 0) {
			await tx
				.update(t.productVariants)
				.set({ ...patch, updatedAt: new Date() })
				.where(eq(t.productVariants.id, variantId));
		}

		// La galerie de la variante est remplacée en bloc, comme celle du produit.
		if (images) {
			await tx.delete(t.variantImages).where(eq(t.variantImages.variantId, variantId));
			if (images.length > 0) {
				await tx.insert(t.variantImages).values(
					images.map((image, index) => ({
						variantId,
						url: image.url,
						alt: image.alt ?? null,
						position: image.position ?? index,
					})),
				);
			}
		}
	});

	return getProduct(productId);
};

/**
 * Supprime une variante. Refuse la dernière : un produit à variantes sans
 * aucune variante n'aurait plus de point de stock et deviendrait invendable
 * sans que rien ne le signale.
 */
export const deleteVariant = async (
	productId: string,
	variantId: string,
): Promise<Product> => {
	const product = await loadProduct(productId);

	if (product.variants.length <= 1) {
		throw conflict(
			"Un produit à variantes doit conserver au moins une variante. Archivez le produit si besoin.",
		);
	}

	const sold = await db
		.select({ id: t.orderItems.id })
		.from(t.orderItems)
		.where(eq(t.orderItems.variantId, variantId))
		.limit(1);

	if (sold.length > 0) {
		// Les lignes de commande conservent leur instantané, mais désactiver
		// plutôt que supprimer garde les liens du back-office intacts.
		await db
			.update(t.productVariants)
			.set({ status: "inactive", updatedAt: new Date() })
			.where(eq(t.productVariants.id, variantId));

		return getProduct(productId);
	}

	await db.delete(t.productVariants).where(eq(t.productVariants.id, variantId));
	return getProduct(productId);
};

// --- Tailles ---------------------------------------------------------------

/**
 * Ajoute une taille, soit à une variante, soit au produit.
 *
 * Le rattachement découle du régime du produit : c'est ce qui rend
 * structurellement impossible de créer une taille de produit sur un produit à
 * variantes depuis cette route.
 */
export const addSize = async (
	productId: string,
	input: SizeInput & { variantId?: string | null },
): Promise<Product> => {
	const product = await loadProduct(productId);

	if (product.kind === "variant" && !input.variantId) {
		throw invalidProductModel(
			"Ce produit est à variantes : la taille doit être rattachée à une variante.",
		);
	}
	if (product.kind === "simple" && input.variantId) {
		throw invalidProductModel(
			"Ce produit est simple : ses tailles se rattachent au produit, pas à une variante.",
		);
	}

	if (input.variantId && !product.variants.some((v) => v.id === input.variantId)) {
		throw notFound("Variante");
	}

	await db.transaction(async (tx) => {
		const [size] = await tx
			.insert(t.sizes)
			.values({
				productId: input.variantId ? null : productId,
				variantId: input.variantId ?? null,
				label: input.label,
				sku: input.sku ?? null,
				priceOverride: input.priceOverride ?? null,
				position: input.position,
				status: input.status,
			})
			.returning({ id: t.sizes.id });

		await tx.insert(t.inventoryItems).values({
			productId,
			variantId: input.variantId ?? null,
			sizeId: size!.id,
			quantity: input.initialQuantity ?? 0,
			lowStockThreshold: input.lowStockThreshold ?? product.lowStockThreshold,
		});

		// Une variante qui reçoit sa première taille perd son point de stock
		// propre : le niveau le plus fin devient variante + taille (§2.3).
		if (input.variantId) {
			await tx
				.delete(t.inventoryItems)
				.where(
					and(
						eq(t.inventoryItems.productId, productId),
						eq(t.inventoryItems.variantId, input.variantId),
						isNull(t.inventoryItems.sizeId),
					),
				);
		} else {
			await tx
				.delete(t.inventoryItems)
				.where(
					and(
						eq(t.inventoryItems.productId, productId),
						isNull(t.inventoryItems.variantId),
						isNull(t.inventoryItems.sizeId),
					),
				);
		}
	});

	return getProduct(productId);
};

export const updateSize = async (
	productId: string,
	sizeId: string,
	input: Partial<SizeInput>,
): Promise<Product> => {
	const { initialQuantity: _q, lowStockThreshold: _l, ...fields } = input;

	const patch = Object.fromEntries(
		Object.entries(fields).filter(([, value]) => value !== undefined),
	);

	if (Object.keys(patch).length === 0) return getProduct(productId);

	const [updated] = await db
		.update(t.sizes)
		.set({ ...patch, updatedAt: new Date() })
		.where(eq(t.sizes.id, sizeId))
		.returning({ id: t.sizes.id });

	if (!updated) throw notFound("Taille");
	return getProduct(productId);
};

/**
 * Supprime une taille. Comme pour les variantes, une taille déjà vendue est
 * désactivée plutôt que supprimée, pour préserver les liens de l'historique.
 */
export const deleteSize = async (
	productId: string,
	sizeId: string,
): Promise<Product> => {
	await loadProduct(productId);

	const sold = await db
		.select({ id: t.orderItems.id })
		.from(t.orderItems)
		.where(eq(t.orderItems.sizeId, sizeId))
		.limit(1);

	if (sold.length > 0) {
		await db
			.update(t.sizes)
			.set({ status: "inactive", updatedAt: new Date() })
			.where(eq(t.sizes.id, sizeId));

		return getProduct(productId);
	}

	const [deleted] = await db
		.delete(t.sizes)
		.where(eq(t.sizes.id, sizeId))
		.returning({ id: t.sizes.id });

	if (!deleted) throw notFound("Taille");
	return getProduct(productId);
};
