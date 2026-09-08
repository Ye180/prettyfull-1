import { deriveStockStatus, } from "@prettyfull/contracts";
import { and, asc, count, desc, eq, gte, inArray, isNull, lte, ne, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { conflict, invalidProductModel, notFound } from "../../lib/errors.js";
import { paginate, toSqlPagination } from "../../lib/response.js";
import { getDescendantIds } from "./categories.service.js";
/**
 * Catalogue produits (§2.1, §2.2).
 *
 * Le service est le gardien de la **règle de cohérence** : un produit est soit
 * « à variantes », soit « simple », jamais les deux. La validation Zod attrape
 * les charges utiles mal formées ; les vérifications ci-dessous couvrent les
 * chemins que Zod ne voit pas (mise à jour partielle, ajout d'une variante à
 * un produit simple), et la contrainte `sizes_owner_xor` en base ferme le
 * dernier recours.
 */
// --- Lecture ---------------------------------------------------------------
/** Prix effectif : cascade taille → variante → produit (§2.2). */
const effectivePrice = (basePrice, variantOverride, sizeOverride) => sizeOverride ?? variantOverride ?? basePrice;
const stockFacts = (stock) => {
    const quantity = stock?.quantity ?? 0;
    const availableQuantity = quantity - (stock?.reservedQuantity ?? 0);
    return {
        quantity,
        availableQuantity,
        stockStatus: deriveStockStatus(availableQuantity, stock?.lowStockThreshold ?? 0, stock?.allowBackorder ?? false),
    };
};
/**
 * Charge un produit complet : images, variantes, tailles, catégories et stock.
 *
 * Les collections sont récupérées en cinq requêtes à plat plutôt qu'en
 * jointure unique : une jointure produit × variantes × tailles × images
 * multiplierait les lignes et rendrait le décompte du stock faux.
 */
const hydrateProducts = async (productIds) => {
    if (productIds.length === 0)
        return new Map();
    const [productRows, imageRows, variantRows, variantImageRows, sizeRows, categoryRows, stockRows] = await Promise.all([
        db.select().from(t.products).where(inArray(t.products.id, productIds)),
        db
            .select()
            .from(t.productImages)
            .where(inArray(t.productImages.productId, productIds))
            .orderBy(asc(t.productImages.position)),
        db
            .select()
            .from(t.productVariants)
            .where(inArray(t.productVariants.productId, productIds))
            .orderBy(asc(t.productVariants.position)),
        db
            .select({
            id: t.variantImages.id,
            variantId: t.variantImages.variantId,
            url: t.variantImages.url,
            alt: t.variantImages.alt,
            position: t.variantImages.position,
        })
            .from(t.variantImages)
            .innerJoin(t.productVariants, eq(t.productVariants.id, t.variantImages.variantId))
            .where(inArray(t.productVariants.productId, productIds))
            .orderBy(asc(t.variantImages.position)),
        db
            .select({
            id: t.sizes.id,
            productId: t.sizes.productId,
            variantId: t.sizes.variantId,
            label: t.sizes.label,
            sku: t.sizes.sku,
            priceOverride: t.sizes.priceOverride,
            position: t.sizes.position,
            status: t.sizes.status,
            ownerProductId: sql `coalesce(${t.sizes.productId}, ${t.productVariants.productId})`,
        })
            .from(t.sizes)
            .leftJoin(t.productVariants, eq(t.productVariants.id, t.sizes.variantId))
            .where(sql `coalesce(${t.sizes.productId}, ${t.productVariants.productId}) in ${productIds}`)
            .orderBy(asc(t.sizes.position)),
        db
            .select({
            productId: t.productCategories.productId,
            id: t.categories.id,
            name: t.categories.name,
            slug: t.categories.slug,
        })
            .from(t.productCategories)
            .innerJoin(t.categories, eq(t.categories.id, t.productCategories.categoryId))
            .where(inArray(t.productCategories.productId, productIds)),
        db
            .select({
            productId: t.inventoryItems.productId,
            variantId: t.inventoryItems.variantId,
            sizeId: t.inventoryItems.sizeId,
            quantity: t.inventoryItems.quantity,
            reservedQuantity: t.inventoryItems.reservedQuantity,
            lowStockThreshold: t.inventoryItems.lowStockThreshold,
            allowBackorder: t.inventoryItems.allowBackorder,
        })
            .from(t.inventoryItems)
            .where(inArray(t.inventoryItems.productId, productIds)),
    ]);
    /** Index du stock par triplet, `-` tenant lieu de « non applicable ». */
    const stockKey = (productId, variantId, sizeId) => `${productId}|${variantId ?? "-"}|${sizeId ?? "-"}`;
    const stockByScope = new Map(stockRows.map((row) => [
        stockKey(row.productId, row.variantId, row.sizeId),
        row,
    ]));
    const result = new Map();
    for (const product of productRows) {
        const variants = variantRows
            .filter((variant) => variant.productId === product.id)
            .map((variant) => {
            const variantSizes = sizeRows
                .filter((size) => size.variantId === variant.id)
                .map((size) => {
                const facts = stockFacts(stockByScope.get(stockKey(product.id, variant.id, size.id)));
                return {
                    id: size.id,
                    productId: null,
                    variantId: variant.id,
                    label: size.label,
                    sku: size.sku,
                    priceOverride: size.priceOverride,
                    position: size.position,
                    status: size.status,
                    lowStockThreshold: null,
                    ...facts,
                };
            });
            // Stock d'une variante : celui de ses tailles si elle en a, sinon
            // le sien propre (accessoire décliné en couleur uniquement).
            const own = stockFacts(stockByScope.get(stockKey(product.id, variant.id, null)));
            const aggregated = variantSizes.length > 0
                ? variantSizes.reduce((acc, size) => ({
                    quantity: acc.quantity + size.quantity,
                    availableQuantity: acc.availableQuantity + size.availableQuantity,
                }), { quantity: 0, availableQuantity: 0 })
                : { quantity: own.quantity, availableQuantity: own.availableQuantity };
            return {
                id: variant.id,
                productId: product.id,
                name: variant.name,
                colorHex: variant.colorHex,
                sku: variant.sku,
                priceOverride: variant.priceOverride,
                compareAtPriceOverride: variant.compareAtPriceOverride,
                status: variant.status,
                position: variant.position,
                lowStockThreshold: null,
                images: variantImageRows
                    .filter((image) => image.variantId === variant.id)
                    .map((image) => ({
                    id: image.id,
                    url: image.url,
                    alt: image.alt,
                    position: image.position,
                })),
                sizes: variantSizes,
                quantity: aggregated.quantity,
                availableQuantity: aggregated.availableQuantity,
                stockStatus: deriveStockStatus(aggregated.availableQuantity, product.lowStockThreshold),
            };
        });
        const productSizes = sizeRows
            .filter((size) => size.productId === product.id)
            .map((size) => {
            const facts = stockFacts(stockByScope.get(stockKey(product.id, null, size.id)));
            return {
                id: size.id,
                productId: product.id,
                variantId: null,
                label: size.label,
                sku: size.sku,
                priceOverride: size.priceOverride,
                position: size.position,
                status: size.status,
                lowStockThreshold: null,
                ...facts,
            };
        });
        // Stock du produit : somme du niveau le plus fin qu'il possède.
        const leaves = variants.length > 0
            ? variants
            : productSizes.length > 0
                ? productSizes
                : [stockFacts(stockByScope.get(stockKey(product.id, null, null)))];
        const totals = leaves.reduce((acc, leaf) => ({
            quantity: acc.quantity + leaf.quantity,
            availableQuantity: acc.availableQuantity + leaf.availableQuantity,
        }), { quantity: 0, availableQuantity: 0 });
        result.set(product.id, {
            id: product.id,
            kind: product.kind,
            name: product.name,
            slug: product.slug,
            shortDescription: product.shortDescription,
            longDescription: product.longDescription,
            sku: product.sku,
            basePrice: product.basePrice,
            compareAtPrice: product.compareAtPrice,
            currency: product.currency,
            status: product.status,
            weightGrams: product.weightGrams,
            lengthMm: product.lengthMm,
            widthMm: product.widthMm,
            heightMm: product.heightMm,
            tags: product.tags,
            publishedAt: product.publishedAt?.toISOString() ?? null,
            metaTitle: product.metaTitle,
            metaDescription: product.metaDescription,
            isFeatured: product.isFeatured,
            lowStockThreshold: product.lowStockThreshold,
            translations: product.translations ?? undefined,
            categoryIds: categoryRows
                .filter((row) => row.productId === product.id)
                .map((row) => row.id),
            categories: categoryRows
                .filter((row) => row.productId === product.id)
                .map((row) => ({ id: row.id, name: row.name, slug: row.slug })),
            images: imageRows
                .filter((image) => image.productId === product.id)
                .map((image) => ({
                id: image.id,
                url: image.url,
                alt: image.alt,
                position: image.position,
            })),
            variants,
            sizes: productSizes,
            quantity: totals.quantity,
            availableQuantity: totals.availableQuantity,
            stockStatus: deriveStockStatus(totals.availableQuantity, product.lowStockThreshold),
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
            archivedAt: product.deletedAt?.toISOString() ?? null,
        });
    }
    return result;
};
export const getProduct = async (id) => {
    const products = await hydrateProducts([id]);
    const product = products.get(id);
    if (!product)
        throw notFound("Produit");
    return product;
};
export const getProductBySlug = async (slug, options = {}) => {
    const filters = [eq(t.products.slug, slug), isNull(t.products.deletedAt)];
    if (options.publishedOnly)
        filters.push(eq(t.products.status, "published"));
    const [row] = await db
        .select({ id: t.products.id })
        .from(t.products)
        .where(and(...filters))
        .limit(1);
    if (!row)
        throw notFound("Produit");
    return getProduct(row.id);
};
const SORTABLE = {
    name: t.products.name,
    basePrice: t.products.basePrice,
    createdAt: t.products.createdAt,
    updatedAt: t.products.updatedAt,
    publishedAt: t.products.publishedAt,
};
export const listProducts = async (query) => {
    const filters = [];
    if (!query.includeArchived)
        filters.push(isNull(t.products.deletedAt));
    if (query.status)
        filters.push(eq(t.products.status, query.status));
    if (query.kind)
        filters.push(eq(t.products.kind, query.kind));
    if (query.isFeatured !== undefined)
        filters.push(eq(t.products.isFeatured, query.isFeatured));
    if (query.minPrice !== undefined)
        filters.push(gte(t.products.basePrice, query.minPrice));
    if (query.maxPrice !== undefined)
        filters.push(lte(t.products.basePrice, query.maxPrice));
    if (query.tag)
        filters.push(sql `${query.tag} = any(${t.products.tags})`);
    // Recherche plein texte insensible aux accents, adossée à l'index GIN.
    if (query.q) {
        filters.push(sql `
			to_tsvector('french', pf_unaccent(coalesce(${t.products.name}, '') || ' ' || coalesce(${t.products.shortDescription}, '')))
			@@ plainto_tsquery('french', pf_unaccent(${query.q}))
			or ${t.products.name} ilike ${`%${query.q}%`}
			or ${t.products.sku} ilike ${`%${query.q}%`}
		`);
    }
    // Une catégorie inclut ses descendantes : filtrer sur « Robes » remonte
    // aussi les produits de « Robes / Soirée ».
    let categoryIds = null;
    if (query.categorySlug) {
        const [category] = await db
            .select({ id: t.categories.id })
            .from(t.categories)
            .where(and(eq(t.categories.slug, query.categorySlug), isNull(t.categories.deletedAt)))
            .limit(1);
        categoryIds = category ? await getDescendantIds(category.id) : [];
    }
    else if (query.categoryId) {
        categoryIds = await getDescendantIds(query.categoryId);
    }
    if (categoryIds) {
        filters.push(categoryIds.length === 0
            ? sql `false`
            : sql `exists (
						select 1 from ${t.productCategories}
						where ${t.productCategories.productId} = ${t.products.id}
						  and ${t.productCategories.categoryId} in ${categoryIds}
					)`);
    }
    if (query.stockStatus) {
        const available = sql `(
			select coalesce(sum(${t.inventoryItems.quantity} - ${t.inventoryItems.reservedQuantity}), 0)
			from ${t.inventoryItems}
			where ${t.inventoryItems.productId} = ${t.products.id}
		)`;
        if (query.stockStatus === "out_of_stock")
            filters.push(sql `${available} <= 0`);
        else if (query.stockStatus === "low_stock") {
            filters.push(sql `${available} > 0 and ${available} <= ${t.products.lowStockThreshold}`);
        }
        else
            filters.push(sql `${available} > ${t.products.lowStockThreshold}`);
    }
    const where = filters.length > 0 ? and(...filters) : undefined;
    const { limit, offset } = toSqlPagination(query);
    const sortColumn = SORTABLE[query.sort] ?? t.products.createdAt;
    const orderBy = query.order === "asc" ? asc(sortColumn) : desc(sortColumn);
    const [rows, [totals]] = await Promise.all([
        db
            .select({ id: t.products.id })
            .from(t.products)
            .where(where)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset),
        db.select({ total: count() }).from(t.products).where(where),
    ]);
    const hydrated = await hydrateProducts(rows.map((row) => row.id));
    // L'ordre de la page vient de la requête paginée, pas de la table de hachage.
    return paginate(rows.flatMap((row) => {
        const product = hydrated.get(row.id);
        return product ? [product] : [];
    }), query, totals?.total ?? 0);
};
// --- Écriture --------------------------------------------------------------
const assertSlugAvailable = async (slug, excludeId) => {
    const filters = [eq(t.products.slug, slug), isNull(t.products.deletedAt)];
    if (excludeId)
        filters.push(ne(t.products.id, excludeId));
    const [existing] = await db
        .select({ id: t.products.id })
        .from(t.products)
        .where(and(...filters))
        .limit(1);
    if (existing) {
        throw conflict("Ce slug est déjà utilisé par un autre produit.", {
            slug: ["Slug déjà pris."],
        });
    }
};
/** Crée un point de stock et son mouvement d'ouverture, dans la transaction. */
const createInventory = async (tx, scope, quantity, lowStockThreshold) => {
    const [item] = await tx
        .insert(t.inventoryItems)
        .values({
        productId: scope.productId,
        variantId: scope.variantId ?? null,
        sizeId: scope.sizeId ?? null,
        quantity,
        lowStockThreshold,
    })
        .returning({ id: t.inventoryItems.id });
    if (quantity > 0) {
        await tx.insert(t.stockMovements).values({
            inventoryItemId: item.id,
            direction: "in",
            quantity,
            quantityBefore: 0,
            quantityAfter: quantity,
            reason: "supplier_receipt",
            note: "Stock initial à la création du produit",
        });
    }
};
/**
 * Crée un produit avec toute sa déclinaison, en une transaction.
 *
 * Tout ou rien : si une taille échoue, aucun produit orphelin ni point de
 * stock isolé ne subsiste.
 */
export const createProduct = async (input, createdBy) => {
    await assertSlugAvailable(input.slug);
    // Filet de sécurité derrière la validation Zod : les deux modèles ne
    // peuvent pas coexister (§2.2).
    if (input.kind === "variant" && input.sizes.length > 0) {
        throw invalidProductModel("Un produit à variantes porte ses tailles au niveau des variantes.");
    }
    if (input.kind === "simple" && input.variants.length > 0) {
        throw invalidProductModel("Un produit simple ne peut pas déclarer de variantes.");
    }
    const productId = await db.transaction(async (tx) => {
        const [product] = await tx
            .insert(t.products)
            .values({
            kind: input.kind,
            name: input.name,
            slug: input.slug,
            shortDescription: input.shortDescription ?? null,
            longDescription: input.longDescription ?? null,
            sku: input.sku ?? null,
            basePrice: input.basePrice,
            compareAtPrice: input.compareAtPrice ?? null,
            currency: input.currency,
            status: input.status,
            weightGrams: input.weightGrams ?? null,
            lengthMm: input.lengthMm ?? null,
            widthMm: input.widthMm ?? null,
            heightMm: input.heightMm ?? null,
            tags: input.tags,
            publishedAt: input.status === "published"
                ? (input.publishedAt ? new Date(input.publishedAt) : new Date())
                : null,
            metaTitle: input.metaTitle ?? null,
            metaDescription: input.metaDescription ?? null,
            isFeatured: input.isFeatured,
            lowStockThreshold: input.lowStockThreshold,
            translations: input.translations,
            createdBy,
        })
            .returning({ id: t.products.id });
        const id = product.id;
        if (input.categoryIds.length > 0) {
            await tx.insert(t.productCategories).values(input.categoryIds.map((categoryId, index) => ({
                productId: id,
                categoryId,
                isPrimary: index === 0,
            })));
        }
        if (input.images.length > 0) {
            await tx.insert(t.productImages).values(input.images.map((image, index) => ({
                productId: id,
                url: image.url,
                alt: image.alt ?? null,
                position: image.position ?? index,
            })));
        }
        if (input.kind === "variant") {
            for (const [variantIndex, variant] of input.variants.entries()) {
                const [inserted] = await tx
                    .insert(t.productVariants)
                    .values({
                    productId: id,
                    name: variant.name,
                    colorHex: variant.colorHex ?? null,
                    sku: variant.sku ?? null,
                    priceOverride: variant.priceOverride ?? null,
                    compareAtPriceOverride: variant.compareAtPriceOverride ?? null,
                    status: variant.status,
                    position: variant.position ?? variantIndex,
                })
                    .returning({ id: t.productVariants.id });
                const variantId = inserted.id;
                if (variant.images.length > 0) {
                    await tx.insert(t.variantImages).values(variant.images.map((image, index) => ({
                        variantId,
                        url: image.url,
                        alt: image.alt ?? null,
                        position: image.position ?? index,
                    })));
                }
                if (variant.sizes.length > 0) {
                    for (const [sizeIndex, size] of variant.sizes.entries()) {
                        const [insertedSize] = await tx
                            .insert(t.sizes)
                            .values({
                            variantId,
                            label: size.label,
                            sku: size.sku ?? null,
                            priceOverride: size.priceOverride ?? null,
                            position: size.position ?? sizeIndex,
                            status: size.status,
                        })
                            .returning({ id: t.sizes.id });
                        await createInventory(tx, { productId: id, variantId, sizeId: insertedSize.id }, size.initialQuantity ?? 0, size.lowStockThreshold ?? input.lowStockThreshold);
                    }
                }
                else {
                    // Variante sans taille : le stock est porté par la variante.
                    await createInventory(tx, { productId: id, variantId }, variant.initialQuantity ?? 0, variant.lowStockThreshold ?? input.lowStockThreshold);
                }
            }
        }
        else if (input.sizes.length > 0) {
            for (const [sizeIndex, size] of input.sizes.entries()) {
                const [insertedSize] = await tx
                    .insert(t.sizes)
                    .values({
                    productId: id,
                    label: size.label,
                    sku: size.sku ?? null,
                    priceOverride: size.priceOverride ?? null,
                    position: size.position ?? sizeIndex,
                    status: size.status,
                })
                    .returning({ id: t.sizes.id });
                await createInventory(tx, { productId: id, sizeId: insertedSize.id }, size.initialQuantity ?? 0, size.lowStockThreshold ?? input.lowStockThreshold);
            }
        }
        else {
            // Produit sans aucune déclinaison : stock au niveau du produit.
            await createInventory(tx, { productId: id }, input.initialQuantity ?? 0, input.lowStockThreshold);
        }
        return id;
    });
    return getProduct(productId);
};
/**
 * Met à jour les champs d'un produit.
 *
 * `kind` est volontairement absent du contrat de mise à jour : changer de
 * régime détruirait le stock et son historique. Le changement passe par une
 * duplication vers un nouveau produit.
 */
export const updateProduct = async (id, input) => {
    const current = await getProduct(id);
    if (input.slug && input.slug !== current.slug) {
        await assertSlugAvailable(input.slug, id);
    }
    const compareAt = input.compareAtPrice ?? current.compareAtPrice;
    const base = input.basePrice ?? current.basePrice;
    if (compareAt != null && compareAt <= base) {
        throw conflict("Le prix barré doit être supérieur au prix de base.", {
            compareAtPrice: ["Doit dépasser le prix de base."],
        });
    }
    await db.transaction(async (tx) => {
        const { categoryIds, images, publishedAt, ...fields } = input;
        await tx
            .update(t.products)
            .set({
            ...Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined)),
            // Publier un brouillon horodate la mise en ligne si elle ne l'est pas déjà.
            ...(input.status === "published" && !current.publishedAt
                ? { publishedAt: publishedAt ? new Date(publishedAt) : new Date() }
                : publishedAt !== undefined
                    ? { publishedAt: publishedAt ? new Date(publishedAt) : null }
                    : {}),
            updatedAt: new Date(),
        })
            .where(eq(t.products.id, id));
        if (categoryIds) {
            await tx.delete(t.productCategories).where(eq(t.productCategories.productId, id));
            if (categoryIds.length > 0) {
                await tx.insert(t.productCategories).values(categoryIds.map((categoryId, index) => ({
                    productId: id,
                    categoryId,
                    isPrimary: index === 0,
                })));
            }
        }
        // La galerie est remplacée en bloc : c'est ce que produit l'éditeur du
        // panel, où l'ordre et les suppressions sont gérés côté client.
        if (images) {
            await tx.delete(t.productImages).where(eq(t.productImages.productId, id));
            if (images.length > 0) {
                await tx.insert(t.productImages).values(images.map((image, index) => ({
                    productId: id,
                    url: image.url,
                    alt: image.alt ?? null,
                    position: image.position ?? index,
                })));
            }
        }
    });
    return getProduct(id);
};
/**
 * Archive un produit (§2.1 : suppression logique, jamais physique).
 *
 * Les commandes passées conservent leur instantané, donc restent lisibles.
 */
export const archiveProduct = async (id) => {
    const now = new Date();
    const [updated] = await db
        .update(t.products)
        .set({ deletedAt: now, status: "archived", updatedAt: now })
        .where(and(eq(t.products.id, id), isNull(t.products.deletedAt)))
        .returning({ id: t.products.id });
    if (!updated)
        throw notFound("Produit");
};
export const restoreProduct = async (id) => {
    const [updated] = await db
        .update(t.products)
        .set({ deletedAt: null, status: "draft", updatedAt: new Date() })
        .where(eq(t.products.id, id))
        .returning({ id: t.products.id });
    if (!updated)
        throw notFound("Produit");
    return getProduct(id);
};
/**
 * Duplique un produit avec sa structure complète (§2.1).
 *
 * Le duplicata part en brouillon, avec un stock à zéro : recopier des
 * quantités qui n'existent pas physiquement fausserait l'inventaire dès la
 * création.
 */
export const duplicateProduct = async (id, options, createdBy) => {
    const source = await getProduct(id);
    const name = options.name ?? `${source.name} (copie)`;
    const slug = options.slug ?? `${source.slug}-copie-${Date.now().toString(36)}`;
    await assertSlugAvailable(slug);
    const input = {
        kind: source.kind,
        name,
        slug,
        shortDescription: source.shortDescription,
        longDescription: source.longDescription,
        // Le SKU n'est pas recopié : il est unique par construction.
        sku: null,
        basePrice: source.basePrice,
        compareAtPrice: source.compareAtPrice,
        currency: source.currency,
        status: "draft",
        weightGrams: source.weightGrams,
        lengthMm: source.lengthMm,
        widthMm: source.widthMm,
        heightMm: source.heightMm,
        tags: source.tags,
        publishedAt: null,
        metaTitle: source.metaTitle,
        metaDescription: source.metaDescription,
        isFeatured: false,
        lowStockThreshold: source.lowStockThreshold,
        categoryIds: source.categoryIds,
        images: options.includeImages
            ? source.images.map((image) => ({
                url: image.url,
                alt: image.alt,
                position: image.position,
            }))
            : [],
        translations: source.translations,
        variants: source.variants.map((variant) => ({
            name: variant.name,
            colorHex: variant.colorHex,
            sku: null,
            priceOverride: variant.priceOverride,
            compareAtPriceOverride: variant.compareAtPriceOverride,
            status: variant.status,
            position: variant.position,
            images: options.includeImages
                ? variant.images.map((image) => ({
                    url: image.url,
                    alt: image.alt,
                    position: image.position,
                }))
                : [],
            sizes: variant.sizes.map((size) => ({
                label: size.label,
                sku: null,
                priceOverride: size.priceOverride,
                position: size.position,
                status: size.status,
            })),
        })),
        sizes: source.sizes.map((size) => ({
            label: size.label,
            sku: null,
            priceOverride: size.priceOverride,
            position: size.position,
            status: size.status,
        })),
    };
    return createProduct(input, createdBy);
};
/** Prix effectif d'une combinaison, exposé pour le panier et les commandes. */
export const resolveLinePrice = effectivePrice;
//# sourceMappingURL=products.service.js.map