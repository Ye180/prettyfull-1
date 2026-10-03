import { PERMISSIONS, categoryListQuerySchema, createCategorySchema, createProductSchema, duplicateProductSchema, productListQuerySchema, reorderCategoriesSchema, sizeInputSchema, updateCategorySchema, updateProductSchema, updateSizeSchema, updateVariantSchema, variantInputSchema, } from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { recordAudit } from "../../lib/audit.js";
import { currentUser, requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as categories from "./categories.service.js";
import * as products from "./products.service.js";
import * as variants from "./variants.service.js";
import { exportProductsCsv, importProductsCsv } from "./csv.service.js";
const idParam = z.object({ id: z.uuid() });
const variantParam = z.object({ id: z.uuid(), variantId: z.uuid() });
const sizeParam = z.object({ id: z.uuid(), sizeId: z.uuid() });
/** Module « Catalogue » du back-office (§4.2). */
export const adminCatalogRoutes = new Hono();
// --- Catégories ------------------------------------------------------------
adminCatalogRoutes.get("/categories", requirePermission(PERMISSIONS.catalog.read), validate("query", categoryListQuerySchema), async (c) => {
    const query = c.req.valid("query");
    if (query.tree)
        return c.json(await categories.getCategoryTree());
    return c.json(await categories.listCategories(query));
});
adminCatalogRoutes.post("/categories", requirePermission(PERMISSIONS.catalog.write), validate("json", createCategorySchema), async (c) => {
    const created = await categories.createCategory(c.req.valid("json"));
    await recordAudit(c, {
        action: "category.created",
        resourceType: "category",
        resourceId: created.id,
        changes: { name: created.name, slug: created.slug },
    });
    return c.json(created, 201);
});
// Déclaré avant `/categories/:id` : sans cela « reorder » serait interprété
// comme un identifiant et échouerait à la validation UUID.
adminCatalogRoutes.post("/categories/reorder", requirePermission(PERMISSIONS.catalog.write), validate("json", reorderCategoriesSchema), async (c) => {
    const { items } = c.req.valid("json");
    await categories.reorderCategories(items);
    await recordAudit(c, {
        action: "category.reordered",
        resourceType: "category",
        changes: { count: items.length },
    });
    return c.json({ success: true });
});
adminCatalogRoutes.get("/categories/:id", requirePermission(PERMISSIONS.catalog.read), validate("param", idParam), async (c) => c.json(await categories.getCategory(c.req.valid("param").id)));
adminCatalogRoutes.patch("/categories/:id", requirePermission(PERMISSIONS.catalog.write), validate("param", idParam), validate("json", updateCategorySchema), async (c) => {
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    const updated = await categories.updateCategory(id, input);
    await recordAudit(c, {
        action: "category.updated",
        resourceType: "category",
        resourceId: id,
        changes: input,
    });
    return c.json(updated);
});
adminCatalogRoutes.delete("/categories/:id", requirePermission(PERMISSIONS.catalog.delete), validate("param", idParam), async (c) => {
    const { id } = c.req.valid("param");
    await categories.archiveCategory(id);
    await recordAudit(c, {
        action: "category.archived",
        resourceType: "category",
        resourceId: id,
    });
    return c.json({ success: true });
});
// --- Produits --------------------------------------------------------------
adminCatalogRoutes.get("/products", requirePermission(PERMISSIONS.catalog.read), validate("query", productListQuerySchema), async (c) => c.json(await products.listProducts(c.req.valid("query"))));
adminCatalogRoutes.post("/products", requirePermission(PERMISSIONS.catalog.write), validate("json", createProductSchema), async (c) => {
    const created = await products.createProduct(c.req.valid("json"), currentUser(c).sub);
    await recordAudit(c, {
        action: "product.created",
        resourceType: "product",
        resourceId: created.id,
        changes: { name: created.name, slug: created.slug, kind: created.kind },
    });
    return c.json(created, 201);
});
// --- Import / export CSV (§4.2) --------------------------------------------
adminCatalogRoutes.get("/products/export", requirePermission(PERMISSIONS.catalog.read), async (c) => {
    const csv = await exportProductsCsv();
    const stamp = new Date().toISOString().slice(0, 10);
    c.header("Content-Type", "text/csv; charset=utf-8");
    c.header("Content-Disposition", `attachment; filename="produits-${stamp}.csv"`);
    return c.body(csv);
});
adminCatalogRoutes.post("/products/import", requirePermission(PERMISSIONS.catalog.import), validate("json", z.object({ csv: z.string().min(1).max(5_000_000), dryRun: z.boolean().default(false) })), async (c) => {
    const { csv, dryRun } = c.req.valid("json");
    const report = await importProductsCsv(csv, currentUser(c).sub, dryRun);
    if (!dryRun) {
        await recordAudit(c, {
            action: "product.imported",
            resourceType: "product",
            changes: { created: report.created, updated: report.updated, errors: report.errors.length },
        });
    }
    return c.json(report);
});
adminCatalogRoutes.get("/products/:id", requirePermission(PERMISSIONS.catalog.read), validate("param", idParam), async (c) => c.json(await products.getProduct(c.req.valid("param").id)));
adminCatalogRoutes.patch("/products/:id", requirePermission(PERMISSIONS.catalog.write), validate("param", idParam), validate("json", updateProductSchema), async (c) => {
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    const updated = await products.updateProduct(id, input);
    await recordAudit(c, {
        action: "product.updated",
        resourceType: "product",
        resourceId: id,
        changes: input,
    });
    return c.json(updated);
});
adminCatalogRoutes.delete("/products/:id", requirePermission(PERMISSIONS.catalog.delete), validate("param", idParam), async (c) => {
    const { id } = c.req.valid("param");
    await products.archiveProduct(id);
    await recordAudit(c, {
        action: "product.archived",
        resourceType: "product",
        resourceId: id,
    });
    return c.json({ success: true });
});
adminCatalogRoutes.post("/products/:id/restore", requirePermission(PERMISSIONS.catalog.write), validate("param", idParam), async (c) => {
    const { id } = c.req.valid("param");
    const restored = await products.restoreProduct(id);
    await recordAudit(c, {
        action: "product.restored",
        resourceType: "product",
        resourceId: id,
    });
    return c.json(restored);
});
adminCatalogRoutes.post("/products/:id/duplicate", requirePermission(PERMISSIONS.catalog.write), validate("param", idParam), validate("json", duplicateProductSchema), async (c) => {
    const { id } = c.req.valid("param");
    const created = await products.duplicateProduct(id, c.req.valid("json"), currentUser(c).sub);
    await recordAudit(c, {
        action: "product.duplicated",
        resourceType: "product",
        resourceId: created.id,
        changes: { sourceId: id },
    });
    return c.json(created, 201);
});
// --- Variantes -------------------------------------------------------------
adminCatalogRoutes.post("/products/:id/variants", requirePermission(PERMISSIONS.catalog.write), validate("param", idParam), validate("json", variantInputSchema), async (c) => {
    const { id } = c.req.valid("param");
    const updated = await variants.addVariant(id, c.req.valid("json"));
    await recordAudit(c, {
        action: "variant.created",
        resourceType: "product",
        resourceId: id,
        changes: { name: c.req.valid("json").name },
    });
    return c.json(updated, 201);
});
adminCatalogRoutes.patch("/products/:id/variants/:variantId", requirePermission(PERMISSIONS.catalog.write), validate("param", variantParam), validate("json", updateVariantSchema), async (c) => {
    const { id, variantId } = c.req.valid("param");
    const updated = await variants.updateVariant(id, variantId, c.req.valid("json"));
    await recordAudit(c, {
        action: "variant.updated",
        resourceType: "variant",
        resourceId: variantId,
        changes: c.req.valid("json"),
    });
    return c.json(updated);
});
adminCatalogRoutes.delete("/products/:id/variants/:variantId", requirePermission(PERMISSIONS.catalog.delete), validate("param", variantParam), async (c) => {
    const { id, variantId } = c.req.valid("param");
    const updated = await variants.deleteVariant(id, variantId);
    await recordAudit(c, {
        action: "variant.deleted",
        resourceType: "variant",
        resourceId: variantId,
    });
    return c.json(updated);
});
// --- Tailles ---------------------------------------------------------------
adminCatalogRoutes.post("/products/:id/sizes", requirePermission(PERMISSIONS.catalog.write), validate("param", idParam), validate("json", sizeInputSchema.extend({ variantId: z.uuid().nullish() })), async (c) => {
    const { id } = c.req.valid("param");
    const updated = await variants.addSize(id, c.req.valid("json"));
    await recordAudit(c, {
        action: "size.created",
        resourceType: "product",
        resourceId: id,
        changes: { label: c.req.valid("json").label },
    });
    return c.json(updated, 201);
});
adminCatalogRoutes.patch("/products/:id/sizes/:sizeId", requirePermission(PERMISSIONS.catalog.write), validate("param", sizeParam), validate("json", updateSizeSchema), async (c) => {
    const { id, sizeId } = c.req.valid("param");
    const updated = await variants.updateSize(id, sizeId, c.req.valid("json"));
    await recordAudit(c, {
        action: "size.updated",
        resourceType: "size",
        resourceId: sizeId,
        changes: c.req.valid("json"),
    });
    return c.json(updated);
});
adminCatalogRoutes.delete("/products/:id/sizes/:sizeId", requirePermission(PERMISSIONS.catalog.delete), validate("param", sizeParam), async (c) => {
    const { id, sizeId } = c.req.valid("param");
    const updated = await variants.deleteSize(id, sizeId);
    await recordAudit(c, {
        action: "size.deleted",
        resourceType: "size",
        resourceId: sizeId,
    });
    return c.json(updated);
});
//# sourceMappingURL=routes.js.map