// =============================================================================
// Export centralisé des composants product
// =============================================================================

export { CardProduct } from "./card-product";
export { ColorSelector } from "./color-selector";
export {
    normalizeCollectionProducts,
    normalizeMultipleCollections,
    normalizeStandaloneProduct,
    normalizeStandaloneProducts
} from "./normalize-collectionProducts";
export type { StandaloneProductInput } from "./normalize-collectionProducts";
export { SizeSelector } from "./size-selector";

// Types
export type {
    NormalizedCollectionProduct,
    NormalizedColorVariant,
    NormalizedVariant, RawCollectionProduct,
    RawProduct
} from "./types";

