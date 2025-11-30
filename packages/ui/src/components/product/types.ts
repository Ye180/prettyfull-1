// =============================================================================
// Types pour les données brutes (JSON Medusa) et les données normalisées
// =============================================================================

// --- Données brutes (JSON tel que reçu de l'API) ---

export interface RawCollectionProduct {
  collection_id: string;
  collection: {
    id: string;
    title: string;
    handle: string;
    created_at?: string;
    updated_at?: string;
  };
  products: RawProduct[];
}

export interface RawProduct {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  handle: string;
  is_giftcard: boolean;
  discountable: boolean;
  thumbnail: string | null;
  collection_id: string | null;
  type_id: string | null;
  weight: number | null;
  length: number | null;
  height: number | null;
  width: number | null;
  hs_code: string | null; // Code couleur (#000000, #08000, etc.)
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  created_at: string;
  updated_at: string;
  type: unknown;
  collection: {
    id: string;
    title: string;
    handle: string;
    metadata: unknown;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  } | null;
  options: RawOption[];
  tags: unknown[];
  images: RawImage[];
  variants: RawVariant[];
}

export interface RawOption {
  id: string;
  title: string;
  metadata: unknown;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  values: RawOptionValue[];
}

export interface RawOptionValue {
  id: string;
  value: string;
  metadata: unknown;
  option_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RawImage {
  id: string;
  url: string;
  metadata: unknown;
  rank: number;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RawVariant {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  ean: string | null;
  upc: string | null;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  weight: number | null;
  length: number | null;
  height: number | null;
  width: number | null;
  metadata: unknown;
  variant_rank: number;
  thumbnail: string | null;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  options: RawVariantOption[];
  /** Present when pricing context is requested (region_id, currency_code) */
  calculated_price?: {
    calculated_amount: number;
    original_amount?: number;
    currency_code?: string;
  };
}

export interface RawVariantOption {
  id: string;
  value: string;
  metadata: unknown;
  option_id: string;
  option: {
    id: string;
    title: string;
    metadata: unknown;
    product_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// --- Données normalisées (structure simplifiée pour les composants) ---

export interface NormalizedVariant {
  id: string;
  title: string;
  sku: string | null;
  size: string;
  calculated_price: {
    calculated_amount: number;
  };
}

export interface NormalizedColorVariant {
  colorCode: string; // Code hex pris depuis hs_code
  label: string; // Ex: "Green", "Black"
  productId: string;
  handle: string;
  thumbnail: string;
  images: string[];
  sizes: string[]; // XS, S, M, L, XL...
  variants: NormalizedVariant[];
  title: string;
  price: number; // Calculated price from first variant
}

export interface NormalizedCollectionProduct {
  collectionId: string;
  collectionTitle: string;
  collectionHandle: string;
  colors: NormalizedColorVariant[];
}
