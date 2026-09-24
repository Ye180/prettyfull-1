"use client";

import type { Category, CurrencyCode, Product } from "@prettyfull/contracts";
import { CURRENCY_CODES } from "@prettyfull/contracts";
import { moneyToInput, parseMoney } from "@/lib/format";
import {
	Checkbox,
	Field,
	Input,
	Select,
	Textarea,
} from "@/components/ui/primitives";

/**
 * Champs scalaires d'un produit - partagés par la création et l'édition.
 *
 * L'état est porté par la page appelante : le formulaire de création doit
 * l'assembler avec la structure des variantes avant l'envoi, celui d'édition
 * n'envoie que les champs modifiés.
 */

export interface ProductFieldsState {
	name: string;
	slug: string;
	shortDescription: string;
	longDescription: string;
	sku: string;
	basePrice: string;
	compareAtPrice: string;
	currency: CurrencyCode;
	status: "draft" | "published" | "archived";
	weightGrams: string;
	tags: string;
	metaTitle: string;
	metaDescription: string;
	isFeatured: boolean;
	lowStockThreshold: string;
	categoryIds: string[];
	nameEn: string;
}

export const emptyProductFields = (
	currency: CurrencyCode = "xof",
): ProductFieldsState => ({
	name: "",
	slug: "",
	shortDescription: "",
	longDescription: "",
	sku: "",
	basePrice: "",
	compareAtPrice: "",
	currency,
	status: "draft",
	weightGrams: "",
	tags: "",
	metaTitle: "",
	metaDescription: "",
	isFeatured: false,
	lowStockThreshold: "5",
	categoryIds: [],
	nameEn: "",
});

/** Dérive un slug depuis le nom : accents retirés, séparateurs normalisés. */
export const slugify = (value: string): string =>
	value
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 160);

/** Traduit l'état du formulaire en charge utile d'API. */
export const toProductPayload = (fields: ProductFieldsState) => ({
	name: fields.name.trim(),
	slug: fields.slug.trim(),
	shortDescription: fields.shortDescription.trim() || null,
	longDescription: fields.longDescription.trim() || null,
	sku: fields.sku.trim() || null,
	basePrice: parseMoney(fields.basePrice, fields.currency),
	compareAtPrice: fields.compareAtPrice
		? parseMoney(fields.compareAtPrice, fields.currency)
		: null,
	currency: fields.currency,
	status: fields.status,
	weightGrams: fields.weightGrams ? Number(fields.weightGrams) : null,
	tags: fields.tags
		.split(",")
		.map((tag) => tag.trim())
		.filter(Boolean),
	metaTitle: fields.metaTitle.trim() || null,
	metaDescription: fields.metaDescription.trim() || null,
	isFeatured: fields.isFeatured,
	lowStockThreshold: Number(fields.lowStockThreshold) || 0,
	categoryIds: fields.categoryIds,
	// Le français vit dans les colonnes ; seule la traduction est stockée à part.
	translations: fields.nameEn.trim()
		? { en: { name: fields.nameEn.trim() } }
		: undefined,
});

export const ProductFields = ({
	value,
	onChange,
	categories,
	errors,
}: {
	value: ProductFieldsState;
	onChange: (next: ProductFieldsState) => void;
	categories: Category[];
	errors?: Record<string, string[]>;
}) => {
	const set = <K extends keyof ProductFieldsState>(
		key: K,
		next: ProductFieldsState[K],
	) => onChange({ ...value, [key]: next });

	const error = (field: string) => errors?.[field]?.[0];

	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-4 sm:grid-cols-2">
				<Field
					label="Nom"
					htmlFor="name"
					required
					error={error("name")}
					className="sm:col-span-2"
				>
					<Input
						id="name"
						value={value.name}
						onChange={(event) => {
							const name = event.target.value;
							// Le slug suit le nom tant qu'il n'a pas été modifié à la main.
							onChange({
								...value,
								name,
								slug:
									value.slug === slugify(value.name) || !value.slug
										? slugify(name)
										: value.slug,
							});
						}}
						placeholder="Robe Cocktail Satinée"
					/>
				</Field>

				<Field
					label="Slug"
					htmlFor="slug"
					required
					error={error("slug")}
					hint="Identifiant dans l'URL du storefront."
				>
					<Input
						id="slug"
						value={value.slug}
						onChange={(event) => set("slug", slugify(event.target.value))}
						placeholder="robe-cocktail-satinee"
					/>
				</Field>

				<Field
					label="SKU"
					htmlFor="sku"
					error={error("sku")}
					hint="Référence interne, facultative."
				>
					<Input
						id="sku"
						value={value.sku}
						onChange={(event) => set("sku", event.target.value)}
					/>
				</Field>

				<Field
					label="Nom (anglais)"
					htmlFor="nameEn"
					hint="Utilisé par la version /en du site."
				>
					<Input
						id="nameEn"
						value={value.nameEn}
						onChange={(event) => set("nameEn", event.target.value)}
						placeholder="Satin Cocktail Dress"
					/>
				</Field>

				<Field label="Statut" htmlFor="status">
					<Select
						id="status"
						value={value.status}
						onChange={(event) =>
							set("status", event.target.value as ProductFieldsState["status"])
						}
						options={[
							{ value: "draft", label: "Brouillon" },
							{ value: "published", label: "Publié" },
							{ value: "archived", label: "Archivé" },
						]}
					/>
				</Field>

				<Field
					label="Description courte"
					htmlFor="shortDescription"
					error={error("shortDescription")}
					className="sm:col-span-2"
				>
					<Input
						id="shortDescription"
						value={value.shortDescription}
						onChange={(event) => set("shortDescription", event.target.value)}
						placeholder="Robe satinée mi-longue, coupe cintrée."
					/>
				</Field>

				<Field
					label="Description longue"
					htmlFor="longDescription"
					className="sm:col-span-2"
				>
					<Textarea
						id="longDescription"
						rows={5}
						value={value.longDescription}
						onChange={(event) => set("longDescription", event.target.value)}
					/>
				</Field>
			</div>

			<div className="grid gap-4 sm:grid-cols-3">
				<Field
					label="Prix de base"
					htmlFor="basePrice"
					required
					error={error("basePrice")}
				>
					<Input
						id="basePrice"
						inputMode="decimal"
						value={value.basePrice}
						onChange={(event) => set("basePrice", event.target.value)}
						placeholder="58000"
					/>
				</Field>

				<Field
					label="Prix barré"
					htmlFor="compareAtPrice"
					error={error("compareAtPrice")}
					hint="Doit dépasser le prix de base."
				>
					<Input
						id="compareAtPrice"
						inputMode="decimal"
						value={value.compareAtPrice}
						onChange={(event) => set("compareAtPrice", event.target.value)}
					/>
				</Field>

				<Field label="Devise" htmlFor="currency">
					<Select
						id="currency"
						value={value.currency}
						onChange={(event) =>
							set("currency", event.target.value as CurrencyCode)
						}
						options={CURRENCY_CODES.map((code) => ({
							value: code,
							label: code.toUpperCase(),
						}))}
					/>
				</Field>

				<Field
					label="Poids (g)"
					htmlFor="weightGrams"
					hint="Sert au calcul des frais de port."
				>
					<Input
						id="weightGrams"
						inputMode="numeric"
						value={value.weightGrams}
						onChange={(event) => set("weightGrams", event.target.value)}
						placeholder="400"
					/>
				</Field>

				<Field
					label="Seuil d'alerte stock"
					htmlFor="lowStockThreshold"
					hint="Alerte quand le disponible descend à ce niveau."
				>
					<Input
						id="lowStockThreshold"
						inputMode="numeric"
						value={value.lowStockThreshold}
						onChange={(event) => set("lowStockThreshold", event.target.value)}
					/>
				</Field>

				<Field
					label="Étiquettes"
					htmlFor="tags"
					hint="Séparées par des virgules."
				>
					<Input
						id="tags"
						value={value.tags}
						onChange={(event) => set("tags", event.target.value)}
						placeholder="soirée, satin"
					/>
				</Field>
			</div>

			<Field label="Catégories" error={error("categoryIds")}>
				<div className="flex flex-wrap gap-x-4 gap-y-2 rounded-md border border-line bg-raised p-3">
					{categories.length === 0 ? (
						<p className="text-[13px] text-subtle">Aucune catégorie créée.</p>
					) : (
						categories.map((category) => (
							<Checkbox
								key={category.id}
								label={category.name}
								checked={value.categoryIds.includes(category.id)}
								onChange={(event) =>
									set(
										"categoryIds",
										event.target.checked
											? [...value.categoryIds, category.id]
											: value.categoryIds.filter((id) => id !== category.id),
									)
								}
							/>
						))
					)}
				</div>
			</Field>

			<Checkbox
				label="Mettre en avant sur la page d'accueil"
				checked={value.isFeatured}
				onChange={(event) => set("isFeatured", event.target.checked)}
			/>

			<div className="grid gap-4 sm:grid-cols-2">
				<Field
					label="Méta-titre"
					htmlFor="metaTitle"
					hint="Titre affiché dans les résultats de recherche."
				>
					<Input
						id="metaTitle"
						value={value.metaTitle}
						onChange={(event) => set("metaTitle", event.target.value)}
					/>
				</Field>

				<Field label="Méta-description" htmlFor="metaDescription">
					<Input
						id="metaDescription"
						value={value.metaDescription}
						onChange={(event) => set("metaDescription", event.target.value)}
					/>
				</Field>
			</div>
		</div>
	);
};

/** Convertit un produit chargé depuis l'API en état de formulaire. */
export const productToFields = (product: Product): ProductFieldsState => ({
	name: product.name,
	slug: product.slug,
	shortDescription: product.shortDescription ?? "",
	longDescription: product.longDescription ?? "",
	sku: product.sku ?? "",
	basePrice: moneyToInput(product.basePrice, product.currency),
	compareAtPrice: product.compareAtPrice
		? moneyToInput(product.compareAtPrice, product.currency)
		: "",
	currency: product.currency,
	status: product.status,
	weightGrams: product.weightGrams ? String(product.weightGrams) : "",
	tags: product.tags.join(", "),
	metaTitle: product.metaTitle ?? "",
	metaDescription: product.metaDescription ?? "",
	isFeatured: product.isFeatured,
	lowStockThreshold: String(product.lowStockThreshold),
	categoryIds: product.categoryIds,
	nameEn: product.translations?.en?.name ?? "",
});
