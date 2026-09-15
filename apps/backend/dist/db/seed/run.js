import { ALL_PERMISSIONS, DEFAULT_STORE_SETTINGS, ROLE_DESCRIPTIONS, ROLE_KEYS, ROLE_LABELS, ROLE_PERMISSIONS, } from "@prettyfull/contracts";
import { sql } from "drizzle-orm";
import { closeDb, db } from "../index.js";
import * as t from "../schema/index.js";
import { hashPassword } from "../../lib/password.js";
import { env } from "../../lib/env.js";
import { SEED_CATEGORIES, SEED_PRODUCTS, SEED_ROOT_CATEGORY, } from "./catalog-data.js";
/**
 * Jeu de données de démonstration (livrable §6).
 *
 * Le script est idempotent : il vide les tables métier avant de réinsérer,
 * pour pouvoir être relancé pendant le développement sans accumuler de
 * doublons. Il refuse de s'exécuter en production.
 */
const DEMO_PASSWORD = "Prettyfull2026!";
/**
 * Code SKU dérivé du slug, sans troncature : tronquer faisait collisionner
 * « ensemble-jogging-chic » et « ensemble-jupe-top » sur le même préfixe.
 */
const skuBase = (slug) => slug.toUpperCase().replaceAll("-", "");
/**
 * Ordre sans importance : `truncate ... cascade` en une seule instruction
 * neutralise les contraintes de clés étrangères entre ces tables.
 */
const TABLES_TO_CLEAR = [
    "audit_logs",
    "reviews",
    "stock_movements",
    "stock_reservations",
    "transactions",
    "webhook_events",
    "refunds",
    "order_status_history",
    "order_items",
    "orders",
    "cart_items",
    "carts",
    "inventory_items",
    "wishlist_items",
    "featured_entries",
    "sizes",
    "variant_images",
    "product_variants",
    "product_images",
    "product_categories",
    "products",
    "categories",
    "banners",
    "static_pages",
    "shipping_rates",
    "shipping_zones",
    "payment_providers",
    "shipping_providers",
    "tax_rates",
    "settings",
    "user_roles",
    "role_permissions",
    "permissions",
    "roles",
    "refresh_tokens",
    "password_reset_tokens",
    "addresses",
    "users",
];
const clearDatabase = async () => {
    const list = TABLES_TO_CLEAR.map((name) => `"${name}"`).join(", ");
    await db.execute(sql.raw(`truncate table ${list} restart identity cascade`));
    console.log(`  tables vidées : ${TABLES_TO_CLEAR.length}`);
};
// --- Rôles et permissions --------------------------------------------------
const seedRbac = async () => {
    const permissionRows = await db
        .insert(t.permissions)
        .values(ALL_PERMISSIONS.map((key) => {
        const [module = "", action = ""] = key.split(".");
        return { key, module, action, description: null };
    }))
        .returning({ id: t.permissions.id, key: t.permissions.key });
    const permissionIdByKey = new Map(permissionRows.map((row) => [row.key, row.id]));
    const roleRows = await db
        .insert(t.roles)
        .values(ROLE_KEYS.map((key) => ({
        key,
        name: ROLE_LABELS[key],
        description: ROLE_DESCRIPTIONS[key],
        isSystem: true,
    })))
        .returning({ id: t.roles.id, key: t.roles.key });
    const roleIdByKey = new Map(roleRows.map((row) => [row.key, row.id]));
    const links = ROLE_KEYS.flatMap((roleKey) => ROLE_PERMISSIONS[roleKey].flatMap((permissionKey) => {
        const roleId = roleIdByKey.get(roleKey);
        const permissionId = permissionIdByKey.get(permissionKey);
        return roleId && permissionId ? [{ roleId, permissionId }] : [];
    }));
    await db.insert(t.rolePermissions).values(links);
    console.log(`  RBAC : ${permissionRows.length} permissions, ${roleRows.length} rôles, ${links.length} liaisons`);
    return roleIdByKey;
};
// --- Utilisateurs ----------------------------------------------------------
const seedUsers = async (roleIdByKey) => {
    // Un seul hachage réutilisé : Argon2 est volontairement lent, le refaire
    // pour chaque compte de démonstration allongerait le seed inutilement.
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    const staffSeeds = [
        { email: "admin@prettyfull.shop", firstName: "Awa", lastName: "Koné", role: "super_admin" },
        { email: "catalogue@prettyfull.shop", firstName: "Fatou", lastName: "Diallo", role: "catalog_manager" },
        { email: "commandes@prettyfull.shop", firstName: "Ibrahim", lastName: "Traoré", role: "order_manager" },
        { email: "support@prettyfull.shop", firstName: "Mariam", lastName: "Bamba", role: "support" },
    ];
    const staffRows = await db
        .insert(t.users)
        .values(staffSeeds.map((staff) => ({
        email: staff.email,
        passwordHash,
        firstName: staff.firstName,
        lastName: staff.lastName,
        kind: "staff",
        status: "active",
        emailVerifiedAt: new Date(),
    })))
        .returning({ id: t.users.id, email: t.users.email });
    const staffIdByEmail = new Map(staffRows.map((row) => [row.email, row.id]));
    await db.insert(t.userRoles).values(staffSeeds.flatMap((staff) => {
        const userId = staffIdByEmail.get(staff.email);
        const roleId = roleIdByKey.get(staff.role);
        return userId && roleId ? [{ userId, roleId }] : [];
    }));
    const [customer] = await db
        .insert(t.users)
        .values({
        email: "cliente@prettyfull.shop",
        passwordHash,
        firstName: "Aminata",
        lastName: "Sow",
        phone: "+225 07 00 00 01",
        kind: "customer",
        emailVerifiedAt: new Date(),
    })
        .returning({ id: t.users.id });
    await db.insert(t.addresses).values({
        userId: customer.id,
        firstName: "Aminata",
        lastName: "Sow",
        address1: "Rue des Jardins, Cocody",
        city: "Abidjan",
        countryCode: "ci",
        phone: "+225 07 00 00 01",
        isDefaultShipping: true,
        isDefaultBilling: true,
    });
    console.log(`  utilisateurs : ${staffRows.length} back-office + 1 cliente (mot de passe « ${DEMO_PASSWORD} »)`);
    return customer.id;
};
// --- Paramètres, taxes, agrégateurs ---------------------------------------
const seedSettingsAndIntegrations = async (adminId) => {
    await db.insert(t.settings).values({
        key: "store",
        value: {
            ...DEFAULT_STORE_SETTINGS,
            storeName: "PrettyFull",
            contactEmail: "contact@prettyfull.shop",
            enabledCurrencies: ["xof", "eur"],
        },
        updatedBy: adminId,
    });
    await db.insert(t.taxRates).values({
        name: "TVA Côte d'Ivoire",
        rateBasisPoints: 1_800,
        countryCode: "ci",
        isInclusive: true,
        isDefault: true,
    });
    await db.insert(t.paymentProviders).values([
        {
            key: "wave",
            name: "Wave",
            description: "Paiement mobile Wave (XOF).",
            // Désactivé tant que les clés API ne sont pas saisies dans le panel :
            // c'est le parcours d'activation décrit au §7.
            isEnabled: false,
            environment: "test",
            position: 0,
        },
        {
            key: "manual",
            name: "Paiement à la livraison",
            description: "Encaissement à la remise du colis, sans prestataire externe.",
            isEnabled: true,
            environment: "live",
            position: 1,
        },
    ]);
    await db.insert(t.shippingProviders).values([
        {
            key: "internal",
            name: "Livraison PrettyFull",
            description: "Livraison assurée en interne, tarifs par zone.",
            isEnabled: true,
            environment: "live",
            supportsLabels: false,
            position: 0,
        },
    ]);
    const zones = await db
        .insert(t.shippingZones)
        .values([
        { name: "Abidjan", countryCodes: ["ci"], isActive: true },
        { name: "Afrique de l'Ouest", countryCodes: ["sn", "ml", "bf", "tg", "bj"], isActive: true },
        { name: "International", countryCodes: ["fr", "be", "us"], isActive: true },
    ])
        .returning({ id: t.shippingZones.id, name: t.shippingZones.name });
    const zoneId = (name) => zones.find((zone) => zone.name === name).id;
    await db.insert(t.shippingRates).values([
        {
            zoneId: zoneId("Abidjan"),
            providerKey: "internal",
            name: "Standard Abidjan (24-48 h)",
            kind: "flat",
            amount: 1_500,
            currency: "xof",
            freeAboveTotal: 50_000,
            estimatedDaysMin: 1,
            estimatedDaysMax: 2,
            position: 0,
        },
        {
            zoneId: zoneId("Abidjan"),
            providerKey: "internal",
            name: "Express Abidjan (même jour)",
            kind: "flat",
            amount: 3_000,
            currency: "xof",
            estimatedDaysMin: 0,
            estimatedDaysMax: 1,
            position: 1,
        },
        {
            zoneId: zoneId("Afrique de l'Ouest"),
            providerKey: "internal",
            name: "Sous-région (3-7 jours)",
            kind: "flat",
            amount: 8_000,
            currency: "xof",
            estimatedDaysMin: 3,
            estimatedDaysMax: 7,
            position: 0,
        },
        {
            zoneId: zoneId("International"),
            providerKey: "internal",
            name: "International (7-14 jours)",
            kind: "weight",
            amount: 25_000,
            currency: "xof",
            minWeightGrams: 0,
            maxWeightGrams: 2_000,
            estimatedDaysMin: 7,
            estimatedDaysMax: 14,
            position: 0,
        },
    ]);
    console.log("  paramètres, taxe, 2 moyens de paiement, 3 zones et 4 tarifs de port");
};
// --- Catalogue -------------------------------------------------------------
const seedCatalog = async (adminId) => {
    const [root] = await db
        .insert(t.categories)
        .values({
        name: SEED_ROOT_CATEGORY.name,
        slug: SEED_ROOT_CATEGORY.slug,
        imageUrl: SEED_ROOT_CATEGORY.imageUrl,
        depth: 0,
        path: SEED_ROOT_CATEGORY.slug,
        translations: { en: { name: SEED_ROOT_CATEGORY.nameEn } },
    })
        .returning({ id: t.categories.id });
    const categoryRows = await db
        .insert(t.categories)
        .values(SEED_CATEGORIES.map((category, index) => ({
        parentId: root.id,
        name: category.name,
        slug: category.slug,
        imageUrl: category.imageUrl,
        position: index,
        isFeatured: Boolean(category.sectionKey),
        depth: 1,
        path: `${SEED_ROOT_CATEGORY.slug}/${category.slug}`,
        translations: { en: { name: category.nameEn } },
    })))
        .returning({ id: t.categories.id, slug: t.categories.slug });
    const categoryIdBySlug = new Map(categoryRows.map((row) => [row.slug, row.id]));
    /**
     * Points de stock créés au fil de l'insertion, avec la quantité initiale.
     * Ils reçoivent tous un mouvement `supplier_receipt` : même le stock de
     * départ est tracé, sans quoi le journal d'audit du §2.3 aurait un trou.
     */
    const inventorySeeds = [];
    /** Index des points de stock, pour retrouver une ligne au moment des commandes. */
    const stockKey = (product, variant, size) => `${product}|${variant ?? "-"}|${size ?? "-"}`;
    const productIdBySlug = new Map();
    for (const seed of SEED_PRODUCTS) {
        const categoryId = categoryIdBySlug.get(seed.categorySlug);
        const [product] = await db
            .insert(t.products)
            .values({
            kind: seed.kind,
            name: seed.name,
            slug: seed.slug,
            shortDescription: seed.description,
            longDescription: `${seed.description}\n\nPièce sélectionnée par PrettyFull, disponible en quantité limitée.`,
            sku: skuBase(seed.slug),
            basePrice: seed.price,
            compareAtPrice: seed.compareAtPrice ?? null,
            currency: "xof",
            status: "published",
            weightGrams: 400,
            tags: seed.tags,
            publishedAt: new Date(),
            metaTitle: `${seed.name} - PrettyFull`,
            metaDescription: seed.description,
            isFeatured: seed.isFeatured ?? false,
            lowStockThreshold: 5,
            translations: { en: { name: seed.nameEn } },
            createdBy: adminId,
        })
            .returning({ id: t.products.id });
        const productId = product.id;
        productIdBySlug.set(seed.slug, productId);
        await db.insert(t.productCategories).values({
            productId,
            categoryId,
            isPrimary: true,
        });
        await db.insert(t.productImages).values(seed.images.map((url, position) => ({ productId, url, alt: seed.name, position })));
        if (seed.kind === "variant") {
            await seedVariants(seed, productId, inventorySeeds);
        }
        else if (seed.sizes.length > 0) {
            const sizeRows = await db
                .insert(t.sizes)
                .values(seed.sizes.map((size, position) => ({
                productId,
                label: size.label,
                sku: `${skuBase(seed.slug)}-${size.label}`,
                position,
            })))
                .returning({ id: t.sizes.id, label: t.sizes.label });
            for (const size of seed.sizes) {
                const row = sizeRows.find((candidate) => candidate.label === size.label);
                inventorySeeds.push({
                    productId,
                    variantId: null,
                    sizeId: row.id,
                    quantity: size.quantity,
                    lowStockThreshold: 5,
                });
            }
        }
        else {
            // Produit sans aucune déclinaison : le stock est porté par le produit.
            inventorySeeds.push({
                productId,
                variantId: null,
                sizeId: null,
                quantity: seed.quantity ?? 10,
                lowStockThreshold: 5,
            });
        }
    }
    const inventoryRows = await db
        .insert(t.inventoryItems)
        .values(inventorySeeds.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        sizeId: item.sizeId,
        quantity: item.quantity,
        reservedQuantity: 0,
        lowStockThreshold: item.lowStockThreshold,
    })))
        .returning({
        id: t.inventoryItems.id,
        productId: t.inventoryItems.productId,
        variantId: t.inventoryItems.variantId,
        sizeId: t.inventoryItems.sizeId,
        quantity: t.inventoryItems.quantity,
    });
    // Réception fournisseur initiale : chaque point de stock démarre avec une
    // ligne de journal, quantité avant 0.
    const openingMovements = inventoryRows
        .filter((row) => row.quantity > 0)
        .map((row) => ({
        inventoryItemId: row.id,
        direction: "in",
        quantity: row.quantity,
        quantityBefore: 0,
        quantityAfter: row.quantity,
        reason: "supplier_receipt",
        note: "Stock initial (jeu de démonstration)",
        userId: adminId,
        userLabel: "Awa Koné",
    }));
    await db.insert(t.stockMovements).values(openingMovements);
    const inventoryIdByKey = new Map(inventoryRows.map((row) => [stockKey(row.productId, row.variantId, row.sizeId), row.id]));
    console.log(`  catalogue : ${SEED_CATEGORIES.length + 1} catégories, ${SEED_PRODUCTS.length} produits, ${inventoryRows.length} points de stock`);
    return { categoryIdBySlug, productIdBySlug, inventoryIdByKey, inventoryRows, stockKey };
};
/** Insère les variantes d'un produit, leurs images, tailles et points de stock. */
const seedVariants = async (seed, productId, inventorySeeds) => {
    for (const [variantIndex, variant] of seed.variants.entries()) {
        const [inserted] = await db
            .insert(t.productVariants)
            .values({
            productId,
            name: variant.name,
            colorHex: variant.colorHex,
            sku: `${skuBase(seed.slug)}-${variant.name.slice(0, 3).toUpperCase()}`,
            position: variantIndex,
        })
            .returning({ id: t.productVariants.id });
        const variantId = inserted.id;
        await db.insert(t.variantImages).values(variant.images.map((url, position) => ({
            variantId,
            url,
            alt: `${seed.name} - ${variant.name}`,
            position,
        })));
        if (variant.sizes.length === 0) {
            // Variante sans taille : le stock est porté par la variante.
            inventorySeeds.push({
                productId,
                variantId,
                sizeId: null,
                quantity: variant.quantities[0] ?? 10,
                lowStockThreshold: 5,
            });
            continue;
        }
        const sizeRows = await db
            .insert(t.sizes)
            .values(variant.sizes.map((label, position) => ({
            variantId,
            label,
            sku: `${skuBase(seed.slug)}-${variant.name.slice(0, 3).toUpperCase()}-${label}`,
            position,
        })))
            .returning({ id: t.sizes.id, label: t.sizes.label });
        for (const [sizeIndex, label] of variant.sizes.entries()) {
            const row = sizeRows.find((candidate) => candidate.label === label);
            inventorySeeds.push({
                productId,
                variantId,
                sizeId: row.id,
                quantity: variant.quantities[sizeIndex] ?? 10,
                lowStockThreshold: 5,
            });
        }
    }
};
export { DEMO_PASSWORD };
// --- Orchestration ---------------------------------------------------------
const run = async () => {
    if (env.NODE_ENV === "production") {
        throw new Error("db:seed est interdit en production.");
    }
    console.log(`seed sur ${new URL(env.DATABASE_URL).host}`);
    await clearDatabase();
    const roleIdByKey = await seedRbac();
    const customerId = await seedUsers(roleIdByKey);
    const [admin] = await db
        .select({ id: t.users.id })
        .from(t.users)
        .where(sql `${t.users.email} = 'admin@prettyfull.shop'`)
        .limit(1);
    const adminId = admin.id;
    await seedSettingsAndIntegrations(adminId);
    const catalog = await seedCatalog(adminId);
    const { seedContent } = await import("./content.js");
    await seedContent(catalog.categoryIdBySlug, catalog.productIdBySlug);
    const { seedOrders } = await import("./orders.js");
    await seedOrders({ adminId, customerId });
    const { seedReviews } = await import("./reviews.js");
    await seedReviews(catalog.productIdBySlug);
    console.log("\nseed terminé.");
    console.log(`  back-office : admin@prettyfull.shop / ${DEMO_PASSWORD}`);
    console.log(`  storefront  : cliente@prettyfull.shop / ${DEMO_PASSWORD}`);
};
run()
    .catch((error) => {
    console.error("échec du seed :", error);
    process.exitCode = 1;
})
    .finally(() => closeDb());
//# sourceMappingURL=run.js.map