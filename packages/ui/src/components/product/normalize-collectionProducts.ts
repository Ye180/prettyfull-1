// =============================================================================
// Helper : Normalise les données brutes d'une collection en structure exploitable
// =============================================================================

import type {
  NormalizedCollectionProduct,
  NormalizedColorVariant,
  NormalizedVariant,
  RawCollectionProduct,
  RawProduct,
  RawVariant,
} from "./types";

/**
 * Extrait le label de couleur depuis le titre du produit.
 * Ex: "Ed Hardy - Green" → "Green"
 */
function extractColorLabelFromTitle(title: string): string {
  const parts = title.split("-");
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    return lastPart ? lastPart.trim() : title.trim();
  }
  return title.trim();
}

/**
 * Trouve l'option "Size" dans les options du produit.
 */
function getSizeOption(product: RawProduct) {
  return product.options.find(
    (opt) =>
      opt.title.toLowerCase() === "size" || opt.title.toLowerCase() === "taille"
  );
}

/** Valeur de l'option "Color"/"Couleur" portée par une variante, si elle existe. */
function getVariantColorValue(variant: RawVariant): string | undefined {
  return variant.options.find(
    (opt) =>
      opt.option.title.toLowerCase() === "color" ||
      opt.option.title.toLowerCase() === "couleur"
  )?.value;
}

/** Valeur de l'option "Size"/"Taille" portée par une variante, si elle existe. */
function getVariantSizeValue(variant: RawVariant): string | undefined {
  return variant.options.find(
    (opt) =>
      opt.option.title.toLowerCase() === "size" ||
      opt.option.title.toLowerCase() === "taille"
  )?.value;
}

function buildVariantEntry(variant: RawVariant): NormalizedVariant {
  const purchasable =
    !variant.manage_inventory ||
    variant.allow_backorder ||
    (variant.inventory_quantity ?? 1) > 0;

  return {
    id: variant.id,
    title: variant.title,
    sku: variant.sku,
    size: getVariantSizeValue(variant) || variant.title,
    purchasable,
    calculated_price: {
      calculated_amount: variant.calculated_price?.calculated_amount ?? 0,
      original_amount: variant.calculated_price?.original_amount,
    },
    variantId: variant.variant_id ?? null,
    sizeId: variant.size_id ?? null,
  };
}

/**
 * Construit un objet NormalizedColorVariant à partir d'un produit brut.
 * Chaque produit enfant représente une couleur différente.
 */
function buildNormalizedColor(product: RawProduct): NormalizedColorVariant {
  // Code couleur depuis hs_code (fallback gris si absent)
  const colorCode = product.hs_code || "#CCCCCC";

  // Label de la couleur extrait du titre
  const label = extractColorLabelFromTitle(product.title);

  // Récupérer les tailles depuis l'option dédiée uniquement — sans option
  // "Size"/"Taille", un produit n'a pas de déclinaison de taille. Retomber
  // sur le titre des variants était une erreur : pour un produit sans
  // variante, ce titre EST le nom du produit lui-même (cf. `buildVariants`
  // côté storefront), qui se retrouvait alors affiché comme une "taille".
  const sizeOption = getSizeOption(product);
  const sizes = sizeOption ? sizeOption.values.map((v) => v.value) : [];

  // Mapper les variants avec leur taille
  const variants: NormalizedVariant[] = product.variants.map(buildVariantEntry);

  // Trier les images par rank
  const sortedImages = [...(product.images ?? [])].sort((a, b) => a.rank - b.rank);

  // Thumbnail principal — laissé vide si le produit n'a réellement aucun
  // visuel : CardProduct affiche alors son propre repli plutôt qu'une image
  // cassée pointant vers un fichier qui n'existe pas.
  const thumbnail = product.thumbnail || sortedImages[0]?.url || "";

  return {
    colorCode,
    label,
    productId: product.id,
    handle: product.handle,
    thumbnail,
    images: sortedImages.map((img) => img.url),
    sizes: Array.from(new Set(sizes)), // Dédupliquer les tailles
    variants,
    title: product.title,
    price: product.variants[0]?.calculated_price?.calculated_amount ?? 0,
    compareAtPrice: product.variants[0]?.calculated_price?.original_amount,
  };
}

/**
 * Normalise les données d'une collection complète.
 * Fusionne les produits enfants comme différentes couleurs d'un même produit.
 *
 * @param raw - Données brutes de la collection (JSON Medusa)
 * @returns Structure normalisée pour CardProduct
 */
export function normalizeCollectionProducts(
  raw: RawCollectionProduct
): NormalizedCollectionProduct {
  const { collection, products } = raw;

  // Chaque produit enfant devient une couleur
  const colors = products.map(buildNormalizedColor);

  return {
    collectionId: collection.id,
    collectionTitle: collection.title,
    collectionHandle: collection.handle,
    colors,
  };
}

/**
 * Normalise un tableau de collections.
 * Utile si tu récupères plusieurs collections d'un coup.
 */
export function normalizeMultipleCollections(
  rawCollections: RawCollectionProduct[]
): NormalizedCollectionProduct[] {
  return rawCollections.map(normalizeCollectionProducts);
}

// =============================================================================
// Standalone Products : Produits sans collection (par catégorie uniquement)
// =============================================================================

export interface StandaloneProductInput {
  product_id: string;
  product: RawProduct;
  category_id: string;
  category: {
    id: string;
    name: string;
    handle: string;
  };
}

/**
 * Regroupe les variantes d'un même produit brut par couleur, pour un seul
 * groupe (`variants`) partageant la même option "Color"/"Couleur".
 *
 * Contrairement à `buildNormalizedColor` — pensé pour le cas "collection"
 * où chaque couleur EST un produit à part —, ici les couleurs vivent toutes
 * dans `product.variants` d'un seul et même produit (modèle du backend :
 * un produit standalone porte directement ses déclinaisons de couleur).
 */
function buildStandaloneColorGroup(
  product: RawProduct,
  label: string,
  groupVariants: RawVariant[]
): NormalizedColorVariant {
  const sortedImages = [...(product.images ?? [])].sort((a, b) => a.rank - b.rank);

  // Vignette : celle de la première variante de ce groupe qui en a une,
  // sinon le visuel du produit.
  const variantWithThumbnail = groupVariants.find((v) => v.thumbnail);
  const thumbnail =
    variantWithThumbnail?.thumbnail || product.thumbnail || sortedImages[0]?.url || "";

  const sizes = Array.from(
    new Set(
      groupVariants
        .map(getVariantSizeValue)
        .filter((size): size is string => Boolean(size))
    )
  );

  const colorCode = groupVariants.find((v) => v.hs_code)?.hs_code || "#CCCCCC";

  return {
    colorCode,
    label,
    productId: product.id,
    handle: product.handle,
    thumbnail,
    images: sortedImages.map((img) => img.url),
    sizes,
    variants: groupVariants.map(buildVariantEntry),
    title: product.title,
    price: groupVariants[0]?.calculated_price?.calculated_amount ?? 0,
    compareAtPrice: groupVariants[0]?.calculated_price?.original_amount,
  };
}

/**
 * Regroupe les variantes d'un produit standalone par couleur réelle
 * (option "Color"/"Couleur"), une entrée `NormalizedColorVariant` par
 * couleur — c'est ce qui alimente les pastilles de `ColorSelector` sur les
 * cartes produit (grille collections, "Tu peux aussi aimer"...).
 *
 * Sans option couleur sur le produit (cas fréquent : bijoux, pièce unique),
 * on retombe sur un seul groupe couvrant toutes les variantes.
 */
function buildStandaloneColorGroups(product: RawProduct): NormalizedColorVariant[] {
  const hasColorOption = product.options.some(
    (opt) =>
      opt.title.toLowerCase() === "color" || opt.title.toLowerCase() === "couleur"
  );

  if (!hasColorOption || product.variants.length === 0) {
    return [buildNormalizedColor(product)];
  }

  const groups = new Map<string, RawVariant[]>();
  for (const variant of product.variants) {
    const colorValue = getVariantColorValue(variant) ?? product.title;
    const group = groups.get(colorValue);
    if (group) {
      group.push(variant);
    } else {
      groups.set(colorValue, [variant]);
    }
  }

  return Array.from(groups.entries()).map(([label, groupVariants]) =>
    buildStandaloneColorGroup(product, label, groupVariants)
  );
}

/**
 * Normalise un produit standalone (sans collection) en structure compatible CardProduct.
 * Ses couleurs réelles (variantes du produit) deviennent chacune une entrée
 * `colors[]`, exactement comme pour une collection classique.
 *
 * @param input - Données du produit standalone avec sa catégorie
 * @returns Structure normalisée avec isStandalone = true
 */
export function normalizeStandaloneProduct(
  input: StandaloneProductInput
): NormalizedCollectionProduct {
  const { product, category } = input;

  return {
    // On utilise l'ID du produit comme "collectionId" pour l'unicité
    collectionId: `standalone_${product.id}`,
    collectionTitle: product.title,
    collectionHandle: product.handle,
    colors: buildStandaloneColorGroups(product),
    // Marqueurs spécifiques aux produits standalone
    isStandalone: true,
    categoryId: category.id,
    categoryName: category.name,
  };
}

/**
 * Normalise un tableau de produits standalone.
 * 
 * @param standaloneProducts - Liste des produits standalone avec leur catégorie
 * @returns Tableau de structures normalisées
 */
export function normalizeStandaloneProducts(
  standaloneProducts: StandaloneProductInput[]
): NormalizedCollectionProduct[] {
  return standaloneProducts.map(normalizeStandaloneProduct);
}
