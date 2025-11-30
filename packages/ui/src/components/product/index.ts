// =============================================================================
// Export centralisé des composants product
// =============================================================================

export { CardProduct } from "./card-product";
export { ColorSelector } from "./color-selector";
export { SizeSelector } from "./size-selector";
export { normalizeCollectionProducts, normalizeMultipleCollections } from "./normalize-collectionProducts";

// Types
export type {
  RawCollectionProduct,
  RawProduct,
  NormalizedCollectionProduct,
  NormalizedColorVariant,
  NormalizedVariant,
} from "./types";
