import { categoryListQuerySchema, productFacetsQuerySchema, productListQuerySchema, } from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import * as categories from "./categories.service.js";
import * as products from "./products.service.js";
const slugParam = z.object({ slug: z.string().min(1).max(160) });
/**
 * Catalogue public, consommé par le storefront.
 *
 * Le statut est forcé à `published` et l'archivé exclu : aucun paramètre de
 * requête ne permet d'atteindre un brouillon depuis cette surface, même en
 * le demandant explicitement.
 */
export const storeCatalogRoutes = new Hono();
storeCatalogRoutes.get("/products", validate("query", productListQuerySchema), async (c) => c.json(await products.listProducts({
    ...c.req.valid("query"),
    status: "published",
    includeArchived: false,
})));
/**
 * Facettes du catalogue (tailles/couleurs distinctes, bornes de prix), pour
 * que le panneau de filtres du storefront reflète les vrais produits.
 *
 * Enregistrée avant `/products/:slug` : sinon `slug` = `"facets"` intercepte
 * la route et la renvoie en 404 (aucun produit de ce slug).
 */
storeCatalogRoutes.get("/products/facets", validate("query", productFacetsQuerySchema), async (c) => c.json(await products.getProductFacets(c.req.valid("query"))));
storeCatalogRoutes.get("/products/:slug", validate("param", slugParam), async (c) => c.json(await products.getProductBySlug(c.req.valid("param").slug, { publishedOnly: true })));
storeCatalogRoutes.get("/categories", validate("query", categoryListQuerySchema), async (c) => {
    const query = c.req.valid("query");
    if (query.tree) {
        const tree = await categories.getCategoryTree({ activeOnly: true });
        const counts = await categories.countProductsByCategory();
        // Le compte de produits est injecté dans l'arbre pour éviter au
        // storefront une requête par rayon.
        const decorate = (nodes) => nodes.map((node) => ({
            ...node,
            productCount: counts.get(node.id) ?? 0,
            children: decorate(node.children),
        }));
        return c.json(decorate(tree));
    }
    return c.json(await categories.listCategories({ ...query, status: "active" }));
});
storeCatalogRoutes.get("/categories/:slug", validate("param", slugParam), async (c) => c.json(await categories.getCategoryBySlug(c.req.valid("param").slug)));
/** Un identifiant est un UUID v4 ; tout le reste est traité comme un slug. */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/**
 * Produits d'un rayon, désigné par son slug **ou** par son identifiant.
 *
 * Le storefront dispose tantôt de l'un, tantôt de l'autre selon d'où vient le
 * lien ; n'accepter que le slug renverrait silencieusement une liste vide
 * plutôt qu'une erreur, ce qui est le pire des deux mondes.
 */
storeCatalogRoutes.get("/categories/:slug/products", validate("param", slugParam), validate("query", productListQuerySchema), async (c) => {
    const { slug } = c.req.valid("param");
    return c.json(await products.listProducts({
        ...c.req.valid("query"),
        ...(UUID_PATTERN.test(slug) ? { categoryId: slug } : { categorySlug: slug }),
        status: "published",
        includeArchived: false,
    }));
});
//# sourceMappingURL=store-routes.js.map