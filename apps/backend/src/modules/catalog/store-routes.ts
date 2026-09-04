import { categoryListQuerySchema, productListQuerySchema } from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { validate } from "../../middleware/validate.js";
import type { AppEnv } from "../../middleware/request-context.js";
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
export const storeCatalogRoutes = new Hono<AppEnv>();

storeCatalogRoutes.get(
	"/products",
	validate("query", productListQuerySchema),
	async (c) =>
		c.json(
			await products.listProducts({
				...c.req.valid("query"),
				status: "published",
				includeArchived: false,
			}),
		),
);

storeCatalogRoutes.get(
	"/products/:slug",
	validate("param", slugParam),
	async (c) =>
		c.json(await products.getProductBySlug(c.req.valid("param").slug, { publishedOnly: true })),
);

storeCatalogRoutes.get(
	"/categories",
	validate("query", categoryListQuerySchema),
	async (c) => {
		const query = c.req.valid("query");

		if (query.tree) {
			const tree = await categories.getCategoryTree({ activeOnly: true });
			const counts = await categories.countProductsByCategory();

			// Le compte de produits est injecté dans l'arbre pour éviter au
			// storefront une requête par rayon.
			const decorate = (nodes: typeof tree): typeof tree =>
				nodes.map((node) => ({
					...node,
					productCount: counts.get(node.id) ?? 0,
					children: decorate(node.children),
				}));

			return c.json(decorate(tree));
		}

		return c.json(await categories.listCategories({ ...query, status: "active" }));
	},
);

storeCatalogRoutes.get(
	"/categories/:slug",
	validate("param", slugParam),
	async (c) => c.json(await categories.getCategoryBySlug(c.req.valid("param").slug)),
);

storeCatalogRoutes.get(
	"/categories/:slug/products",
	validate("param", slugParam),
	validate("query", productListQuerySchema),
	async (c) =>
		c.json(
			await products.listProducts({
				...c.req.valid("query"),
				categorySlug: c.req.valid("param").slug,
				status: "published",
				includeArchived: false,
			}),
		),
);
