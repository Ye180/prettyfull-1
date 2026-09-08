/**
 * Catalogue de démonstration.
 *
 * Repris à l'identique des données statiques du storefront
 * (`apps/web/src/lib/fake-data`) : mêmes catégories, mêmes produits, mêmes
 * visuels de `/public`. La bascule du storefront vers l'API réelle est donc
 * invisible à l'écran, ce qui rend toute régression facile à repérer.
 *
 * Les prix d'origine étaient exprimés en euros ; ils sont convertis en francs
 * CFA, devise par défaut de la boutique.
 */
/** Convertit un prix en euros vers un montant XOF arrondi au multiple de 500. */
const toXof = (euros) => Math.round((euros * 655.957) / 500) * 500;
/** Les six rayons de la boutique, tous enfants de la racine « Boutique ». */
export const SEED_ROOT_CATEGORY = {
    slug: "boutique",
    name: "Boutique",
    nameEn: "Shop",
    imageUrl: "/category/category-principale.jpg",
};
export const SEED_CATEGORIES = [
    {
        slug: "robes",
        name: "Robes",
        nameEn: "Dresses",
        imageUrl: "/category/category-principale.jpg",
        sectionKey: "third_section",
    },
    { slug: "hauts", name: "Hauts", nameEn: "Tops", imageUrl: "/category/category1.jpg" },
    {
        slug: "ensembles",
        name: "Ensembles",
        nameEn: "Sets",
        imageUrl: "/home/arrivals-1.jpg",
        sectionKey: "sixth_section",
    },
    {
        slug: "accessoires",
        name: "Accessoires",
        nameEn: "Accessories",
        imageUrl: "/home/arrivals-2.jpg",
    },
    {
        slug: "nouveautes",
        name: "Nouveautés",
        nameEn: "New Arrivals",
        imageUrl: "/home/arrivals-3.jpg",
        sectionKey: "eight_section",
    },
    { slug: "soldes", name: "Soldes", nameEn: "Sale", imageUrl: "/home/arrivals-4.jpg" },
];
/** Visuels déjà présents dans `apps/web/public`, piochés en rotation. */
const IMAGE_POOL = [
    "/banner/banner1.jpg",
    "/banner/banner2.jpg",
    "/banner/banner3.jpg",
    "/banner/banner4.jpg",
    "/banner/banner5.jpg",
    "/banner/banner6.jpg",
    "/banner/banner8.jpg",
    "/home/arrivals-1.jpg",
    "/home/arrivals-2.jpg",
    "/home/arrivals-3.jpg",
    "/home/arrivals-4.jpg",
    "/home/commerce.jpg",
    "/home/commerce1.jpg",
    "/home/cover-box-3.jpg",
    "/home/cover-box-7.jpg",
    "/home/cover-box-second-1.jpg",
    "/home/cover-box-second-3.jpg",
    "/home/cover-box-second-4.jpg",
    "/home/cover-box-second-5.jpg",
    "/collections/banner-mode.jpg",
    "/assets/product_1.jpg",
    "/assets/product_2.jpg",
    "/assets/product5.webp",
];
let imageCursor = 0;
const nextImages = (count) => Array.from({ length: count }, () => IMAGE_POOL[imageCursor++ % IMAGE_POOL.length]);
export const COLOR_HEX = {
    Noir: "#111111",
    Beige: "#d9c7b0",
    Bordeaux: "#6b1f2e",
    Blanc: "#f5f5f0",
    Kaki: "#6e6b4a",
};
const APPAREL_SIZES = ["S", "M", "L"];
const APPAREL_COLORS = ["Noir", "Beige"];
const SOURCES = [
    // --- Robes ---------------------------------------------------------------
    { slug: "robe-cocktail-satinee", name: "Robe Cocktail Satinée", nameEn: "Satin Cocktail Dress", description: "Robe satinée mi-longue, coupe cintrée, idéale pour vos soirées.", categorySlug: "robes", price: 89, tags: ["soirée", "satin"], isFeatured: true },
    { slug: "robe-fleurie-ete", name: "Robe Fleurie Été", nameEn: "Summer Floral Dress", description: "Robe légère à motifs fleuris, parfaite pour la saison chaude.", categorySlug: "robes", price: 65, tags: ["été", "fleuri"] },
    { slug: "robe-longue-fluide", name: "Robe Longue Fluide", nameEn: "Long Flowy Dress", description: "Robe longue en tissu fluide, silhouette élégante et confortable.", categorySlug: "robes", price: 98, tags: ["élégant"], isFeatured: true },
    // --- Hauts ---------------------------------------------------------------
    { slug: "top-en-soie", name: "Top en Soie", nameEn: "Silk Top", description: "Haut en soie douce, coupe ajustée, à porter en toute occasion.", categorySlug: "hauts", price: 55, tags: ["soie"] },
    // Produit simple à tailles : démontre le second régime du §2.2.
    { slug: "crop-top-cotele", name: "Crop Top Côtelé", nameEn: "Ribbed Crop Top", description: "Crop top côtelé stretch, parfait pour un look casual chic.", categorySlug: "hauts", price: 32, model: "sizes-only", tags: ["casual"], quantities: [3, 0, 14] },
    { slug: "chemise-oversize", name: "Chemise Oversize", nameEn: "Oversized Shirt", description: "Chemise oversize en coton, facile à assortir.", categorySlug: "hauts", price: 48, tags: ["coton"] },
    // --- Ensembles -----------------------------------------------------------
    { slug: "ensemble-tailleur", name: "Ensemble Tailleur", nameEn: "Tailored Set", description: "Ensemble blazer + pantalon assorti, coupe structurée.", categorySlug: "ensembles", price: 140, tags: ["tailleur"], isFeatured: true },
    { slug: "ensemble-jogging-chic", name: "Ensemble Jogging Chic", nameEn: "Chic Jogging Set", description: "Ensemble sweat + jogging en molleton doux.", categorySlug: "ensembles", price: 78, tags: ["confort"] },
    { slug: "ensemble-jupe-top", name: "Ensemble Jupe & Top", nameEn: "Skirt & Top Set", description: "Ensemble coordonné jupe midi et top assorti.", categorySlug: "ensembles", price: 92, tags: ["coordonné"] },
    // --- Accessoires ---------------------------------------------------------
    // Variantes couleur sans taille : le stock est porté par la variante.
    { slug: "sac-a-main-cuir", name: "Sac à Main Cuir", nameEn: "Leather Handbag", description: "Sac à main en cuir vegan, format quotidien.", categorySlug: "accessoires", price: 75, model: "colors-only", colors: ["Noir", "Beige"], tags: ["cuir"] },
    { slug: "foulard-imprime", name: "Foulard Imprimé", nameEn: "Printed Scarf", description: "Foulard en soie imprimée, accessoire polyvalent.", categorySlug: "accessoires", price: 28, model: "colors-only", colors: ["Bordeaux", "Blanc"], tags: ["soie"] },
    // Produit sans aucune déclinaison : le stock est porté par le produit.
    { slug: "boucles-oreilles-dorees", name: "Boucles d'Oreilles Dorées", nameEn: "Gold Earrings", description: "Boucles d'oreilles plaquées or, finition brillante.", categorySlug: "accessoires", price: 22, model: "single", tags: ["bijou"], quantities: [4] },
    // --- Nouveautés ----------------------------------------------------------
    { slug: "blazer-structure", name: "Blazer Structuré", nameEn: "Structured Blazer", description: "Blazer à épaulettes, coupe droite, nouvelle collection.", categorySlug: "nouveautes", price: 110, tags: ["nouveauté"], isFeatured: true },
    { slug: "pantalon-taille-haute", name: "Pantalon Taille Haute", nameEn: "High-Waisted Pants", description: "Pantalon taille haute en tissu stretch, coupe droite.", categorySlug: "nouveautes", price: 62, tags: ["nouveauté"] },
    { slug: "manteau-long-laine", name: "Manteau Long Laine", nameEn: "Long Wool Coat", description: "Manteau long en laine mélangée, doublure intérieure.", categorySlug: "nouveautes", price: 158, tags: ["hiver", "laine"] },
    // --- Soldes --------------------------------------------------------------
    { slug: "jean-slim-delave", name: "Jean Slim Délavé", nameEn: "Faded Slim Jeans", description: "Jean slim délavé, coupe taille haute.", categorySlug: "soldes", price: 45, discountPercent: 30, tags: ["promo", "denim"] },
    { slug: "pull-en-maille", name: "Pull en Maille", nameEn: "Knit Sweater", description: "Pull en maille douce, coupe ample.", categorySlug: "soldes", price: 39, discountPercent: 25, tags: ["promo"] },
    { slug: "jupe-plissee", name: "Jupe Plissée", nameEn: "Pleated Skirt", description: "Jupe plissée midi, taille élastiquée.", categorySlug: "soldes", price: 35, discountPercent: 20, tags: ["promo"] },
];
/** Quantités par défaut, variées pour rendre les écrans de stock parlants. */
const defaultQuantities = (count, offset) => Array.from({ length: count }, (_, index) => 6 + ((offset + index * 5) % 22));
export const SEED_PRODUCTS = SOURCES.map((source, sourceIndex) => {
    const model = source.model ?? "apparel";
    const images = nextImages(3);
    const price = toXof(source.price);
    const compareAtPrice = source.discountPercent
        ? toXof(Math.round(source.price / (1 - source.discountPercent / 100)))
        : undefined;
    const base = {
        slug: source.slug,
        name: source.name,
        nameEn: source.nameEn,
        description: source.description,
        categorySlug: source.categorySlug,
        price,
        compareAtPrice,
        images,
        tags: source.tags ?? [],
        isFeatured: source.isFeatured ?? false,
    };
    if (model === "single") {
        return {
            ...base,
            kind: "simple",
            variants: [],
            sizes: [],
            quantity: source.quantities?.[0] ?? 10,
        };
    }
    if (model === "sizes-only") {
        const quantities = source.quantities ?? defaultQuantities(APPAREL_SIZES.length, sourceIndex);
        return {
            ...base,
            kind: "simple",
            variants: [],
            sizes: APPAREL_SIZES.map((label, index) => ({
                label,
                quantity: quantities[index] ?? 10,
            })),
        };
    }
    const colors = source.colors ?? APPAREL_COLORS;
    const sizes = model === "colors-only" ? [] : APPAREL_SIZES;
    return {
        ...base,
        kind: "variant",
        sizes: [],
        variants: colors.map((color, colorIndex) => ({
            name: color,
            colorHex: COLOR_HEX[color] ?? "#cccccc",
            images: [images[colorIndex % images.length]],
            sizes,
            quantities: sizes.length > 0
                ? defaultQuantities(sizes.length, sourceIndex + colorIndex * 3)
                : [defaultQuantities(1, sourceIndex + colorIndex)[0]],
        })),
    };
});
//# sourceMappingURL=catalog-data.js.map