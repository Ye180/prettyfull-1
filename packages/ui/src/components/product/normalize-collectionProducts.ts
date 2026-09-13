// =============================================================================
// Helper : Normalise les données brutes d'une collection en structure exploitable
// =============================================================================

import type {
  NormalizedCollectionProduct,
  NormalizedColorVariant,
  NormalizedVariant,
  RawCollectionProduct,
  RawProduct,
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

/**
 * Construit un objet NormalizedColorVariant à partir d'un produit brut.
 * Chaque produit enfant représente une couleur différente.
 */
function buildNormalizedColor(product: RawProduct): NormalizedColorVariant {
  // Code couleur depuis hs_code (fallback gris si absent)
  const colorCode = product.hs_code || "#CCCCCC";

  // Label de la couleur extrait du titre
  const label = extractColorLabelFromTitle(product.title);

  // Récupérer les tailles depuis les options ou les variants
  const sizeOption = getSizeOption(product);
  const sizes = sizeOption
    ? sizeOption.values.map((v) => v.value)
    : product.variants.map((v) => v.title);

  // Mapper les variants avec leur taille
  const variants: NormalizedVariant[] = product.variants.map((variant) => {
    const sizeOpt = variant.options.find(
      (opt) =>
        opt.option.title.toLowerCase() === "size" ||
        opt.option.title.toLowerCase() === "taille"
    );
    const purchasable =
      !variant.manage_inventory ||
      variant.allow_backorder ||
      (variant.inventory_quantity ?? 1) > 0;
    return {
      id: variant.id,
      title: variant.title,
      sku: variant.sku,
      size: sizeOpt?.value || variant.title,
      purchasable,
      calculated_price: {
        calculated_amount: variant.calculated_price?.calculated_amount ?? 0,
        original_amount: variant.calculated_price?.original_amount,
      },
      variantId: variant.variant_id ?? null,
      sizeId: variant.size_id ?? null,
    };
  });

  // Trier les images par rank
  const sortedImages = [...(product.images ?? [])].sort((a, b) => a.rank - b.rank);

  // Thumbnail principal
  const thumbnail =
    product.thumbnail || sortedImages[0]?.url || "/placeholder-product.png";

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
 * Normalise un produit standalone (sans collection) en structure compatible CardProduct.
 * Le produit est traité comme ayant une seule "couleur" (lui-même).
 * 
 * @param input - Données du produit standalone avec sa catégorie
 * @returns Structure normalisée avec isStandalone = true
 */
export function normalizeStandaloneProduct(
  input: StandaloneProductInput
): NormalizedCollectionProduct {
  const { product, category } = input;

  // Le produit standalone devient sa propre "couleur"
  const color = buildNormalizedColor(product);

  return {
    // On utilise l'ID du produit comme "collectionId" pour l'unicité
    collectionId: `standalone_${product.id}`,
    collectionTitle: product.title,
    collectionHandle: product.handle,
    colors: [color],
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
