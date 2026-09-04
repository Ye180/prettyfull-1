import { createProductSchema, updateProductSchema } from "@prettyfull/contracts";
import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { createProduct, updateProduct } from "./products.service.js";

/**
 * Import / export CSV du catalogue (§4.2).
 *
 * Le format est volontairement « une ligne par point de stock » : c'est la
 * granularité que manipule un gestionnaire de catalogue dans un tableur, et
 * elle permet d'exprimer les deux régimes du §2.2 dans un même fichier —
 * la colonne `variante` reste vide pour un produit simple.
 */

const COLUMNS = [
	"slug",
	"nom",
	"regime",
	"statut",
	"categorie",
	"prix",
	"prix_barre",
	"devise",
	"sku",
	"variante",
	"couleur_hex",
	"taille",
	"stock",
	"seuil_alerte",
	"poids_g",
	"description_courte",
	"tags",
	"image_principale",
] as const;

/** Échappe une valeur selon RFC 4180 (guillemets doublés si nécessaire). */
const escapeCell = (value: unknown): string => {
	if (value === null || value === undefined) return "";
	const text = String(value);
	return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

/**
 * Découpe une ligne CSV en respectant les champs entre guillemets.
 *
 * Écrit à la main plutôt qu'avec une dépendance : le format produit ici est
 * connu, et l'analyseur tient en vingt lignes.
 */
const parseLine = (line: string): string[] => {
	const cells: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let index = 0; index < line.length; index += 1) {
		const char = line[index];

		if (inQuotes) {
			if (char === '"') {
				// Guillemet doublé : c'est un guillemet littéral, pas une fermeture.
				if (line[index + 1] === '"') {
					current += '"';
					index += 1;
				} else {
					inQuotes = false;
				}
			} else {
				current += char;
			}
			continue;
		}

		if (char === '"') inQuotes = true;
		else if (char === ",") {
			cells.push(current);
			current = "";
		} else current += char;
	}

	cells.push(current);
	return cells.map((cell) => cell.trim());
};

export const exportProductsCsv = async (): Promise<string> => {
	const rows = await db
		.select({
			slug: t.products.slug,
			name: t.products.name,
			kind: t.products.kind,
			status: t.products.status,
			basePrice: t.products.basePrice,
			compareAtPrice: t.products.compareAtPrice,
			currency: t.products.currency,
			productSku: t.products.sku,
			weightGrams: t.products.weightGrams,
			shortDescription: t.products.shortDescription,
			tags: t.products.tags,
			variantName: t.productVariants.name,
			colorHex: t.productVariants.colorHex,
			variantSku: t.productVariants.sku,
			sizeLabel: t.sizes.label,
			sizeSku: t.sizes.sku,
			quantity: t.inventoryItems.quantity,
			lowStockThreshold: t.inventoryItems.lowStockThreshold,
			categoryName: t.categories.name,
			image: t.productImages.url,
		})
		.from(t.inventoryItems)
		.innerJoin(t.products, eq(t.products.id, t.inventoryItems.productId))
		.leftJoin(t.productVariants, eq(t.productVariants.id, t.inventoryItems.variantId))
		.leftJoin(t.sizes, eq(t.sizes.id, t.inventoryItems.sizeId))
		.leftJoin(
			t.productCategories,
			and(
				eq(t.productCategories.productId, t.products.id),
				eq(t.productCategories.isPrimary, true),
			),
		)
		.leftJoin(t.categories, eq(t.categories.id, t.productCategories.categoryId))
		.leftJoin(
			t.productImages,
			and(eq(t.productImages.productId, t.products.id), eq(t.productImages.position, 0)),
		)
		.where(isNull(t.products.deletedAt))
		.orderBy(asc(t.products.name), asc(t.productVariants.position), asc(t.sizes.position));

	const lines = [COLUMNS.join(",")];

	for (const row of rows) {
		lines.push(
			[
				row.slug,
				row.name,
				row.kind,
				row.status,
				row.categoryName,
				row.basePrice,
				row.compareAtPrice,
				row.currency,
				row.sizeSku ?? row.variantSku ?? row.productSku,
				row.variantName,
				row.colorHex,
				row.sizeLabel,
				row.quantity,
				row.lowStockThreshold,
				row.weightGrams,
				row.shortDescription,
				row.tags.join("|"),
				row.image,
			]
				.map(escapeCell)
				.join(","),
		);
	}

	// BOM UTF-8 : sans lui, Excel sous Windows affiche « Robe fleurie » en mojibake.
	return `\uFEFF${lines.join("\r\n")}`;
};

export interface ImportReport {
	created: number;
	updated: number;
	skipped: number;
	errors: { line: number; slug: string; message: string }[];
	/** `true` : rien n'a été écrit, le rapport est une simulation. */
	dryRun: boolean;
}

interface GroupedRow {
	line: number;
	cells: Record<string, string>;
}

/**
 * Importe un catalogue depuis un CSV.
 *
 * Les lignes sont regroupées par `slug` : un produit à variantes s'étale sur
 * plusieurs lignes, reconstituées en une seule création. Un produit déjà
 * présent voit ses champs mis à jour, sans que sa structure de variantes ni
 * son stock soient écrasés — remplacer une déclinaison en masse détruirait
 * l'historique de stock, ce qui n'est jamais ce qu'un import cherche à faire.
 */
export const importProductsCsv = async (
	csv: string,
	userId: string,
	dryRun = false,
): Promise<ImportReport> => {
	const report: ImportReport = { created: 0, updated: 0, skipped: 0, errors: [], dryRun };

	const content = csv.replace(/^\uFEFF/, "");
	const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);

	if (lines.length < 2) {
		report.errors.push({ line: 0, slug: "", message: "Fichier vide ou sans ligne de données." });
		return report;
	}

	const header = parseLine(lines[0]!).map((cell) => cell.toLowerCase());
	const groups = new Map<string, GroupedRow[]>();

	for (const [index, line] of lines.slice(1).entries()) {
		const cells = parseLine(line);
		const record: Record<string, string> = {};
		header.forEach((name, position) => {
			record[name] = cells[position] ?? "";
		});

		const slug = record.slug?.trim();
		if (!slug) {
			report.errors.push({ line: index + 2, slug: "", message: "Colonne « slug » manquante." });
			continue;
		}

		const list = groups.get(slug) ?? [];
		list.push({ line: index + 2, cells: record });
		groups.set(slug, list);
	}

	const categoryRows = await db
		.select({ id: t.categories.id, name: t.categories.name, slug: t.categories.slug })
		.from(t.categories)
		.where(isNull(t.categories.deletedAt));

	const categoryByName = new Map(
		categoryRows.flatMap((row) => [
			[row.name.toLowerCase(), row.id] as const,
			[row.slug.toLowerCase(), row.id] as const,
		]),
	);

	for (const [slug, rows] of groups) {
		const first = rows[0]!;
		const cells = first.cells;

		try {
			const [existing] = await db
				.select({ id: t.products.id })
				.from(t.products)
				.where(and(eq(t.products.slug, slug), isNull(t.products.deletedAt)))
				.limit(1);

			const categoryId = categoryByName.get((cells.categorie ?? "").toLowerCase());

			const common = {
				name: cells.nom || slug,
				slug,
				shortDescription: cells.description_courte || null,
				sku: cells.sku || null,
				basePrice: Number(cells.prix || 0),
				compareAtPrice: cells.prix_barre ? Number(cells.prix_barre) : null,
				currency: (cells.devise || "xof").toLowerCase(),
				status: (cells.statut || "draft") as "draft" | "published" | "archived",
				weightGrams: cells.poids_g ? Number(cells.poids_g) : null,
				tags: cells.tags ? cells.tags.split("|").map((tag) => tag.trim()).filter(Boolean) : [],
				categoryIds: categoryId ? [categoryId] : [],
				images: cells.image_principale
					? [{ url: cells.image_principale, alt: cells.nom || slug, position: 0 }]
					: [],
			};

			if (existing) {
				// Mise à jour : seuls les champs scalaires bougent. La structure et
				// le stock restent pilotés par le module Stocks.
				const parsed = updateProductSchema.parse(common);
				if (!dryRun) await updateProduct(existing.id, parsed);
				report.updated += 1;
				continue;
			}

			const kind = (cells.regime || "").toLowerCase() === "variant" ? "variant" : "simple";

			// Reconstitution de la déclinaison depuis les lignes du groupe.
			const variantMap = new Map<
				string,
				{
					name: string;
					colorHex: string | null;
					sizes: { label: string; initialQuantity: number }[];
					initialQuantity: number;
				}
			>();
			const productSizes: { label: string; initialQuantity: number }[] = [];
			let standaloneQuantity = 0;

			for (const row of rows) {
				const quantity = Number(row.cells.stock || 0);
				const variantName = row.cells.variante?.trim();
				const sizeLabel = row.cells.taille?.trim();

				if (kind === "variant" && variantName) {
					const variant = variantMap.get(variantName) ?? {
						name: variantName,
						colorHex: row.cells.couleur_hex || null,
						sizes: [],
						initialQuantity: 0,
					};
					if (sizeLabel) variant.sizes.push({ label: sizeLabel, initialQuantity: quantity });
					else variant.initialQuantity = quantity;
					variantMap.set(variantName, variant);
				} else if (sizeLabel) {
					productSizes.push({ label: sizeLabel, initialQuantity: quantity });
				} else {
					standaloneQuantity = quantity;
				}
			}

			const input = createProductSchema.parse({
				...common,
				kind,
				variants: [...variantMap.values()].map((variant, index) => ({
					name: variant.name,
					colorHex: variant.colorHex,
					position: index,
					images: [],
					sizes: variant.sizes.map((size, sizeIndex) => ({
						label: size.label,
						position: sizeIndex,
						initialQuantity: size.initialQuantity,
					})),
					...(variant.sizes.length === 0
						? { initialQuantity: variant.initialQuantity }
						: {}),
				})),
				sizes: productSizes.map((size, index) => ({
					label: size.label,
					position: index,
					initialQuantity: size.initialQuantity,
				})),
				...(kind === "simple" && productSizes.length === 0
					? { initialQuantity: standaloneQuantity }
					: {}),
			});

			if (!dryRun) await createProduct(input, userId);
			report.created += 1;
		} catch (error) {
			report.skipped += 1;
			report.errors.push({
				line: first.line,
				slug,
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}

	return report;
};
