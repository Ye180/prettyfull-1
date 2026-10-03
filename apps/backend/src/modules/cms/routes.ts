import {
	BANNER_PLACEMENTS,
	PERMISSIONS,
	bannerInputSchema,
	bannerListQuerySchema,
	contactMessageInputSchema,
	contactMessageListQuerySchema,
	contentHighlightInputSchema,
	contentHighlightListQuerySchema,
	updateContactMessageSchema,
	updateContentHighlightSchema,
	updateFeaturedEntrySchema,
	featuredEntryInputSchema,
	staticPageInputSchema,
	staticPageListQuerySchema,
	updateBannerSchema,
} from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { recordAudit } from "../../lib/audit.js";
import { currentUser, requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import type { AppEnv } from "../../middleware/request-context.js";
import * as service from "./service.js";

const idParam = z.object({ id: z.uuid() });
const slugParam = z.object({ slug: z.string().min(1).max(160) });

/** Module « Contenu » du back-office (§4.7). */
export const adminCmsRoutes = new Hono<AppEnv>();

adminCmsRoutes.get(
	"/banners",
	requirePermission(PERMISSIONS.content.read),
	validate("query", bannerListQuerySchema),
	async (c) => c.json(await service.listBanners(c.req.valid("query"))),
);

adminCmsRoutes.post(
	"/banners",
	requirePermission(PERMISSIONS.content.write),
	validate("json", bannerInputSchema),
	async (c) => {
		const created = await service.createBanner(c.req.valid("json"));

		await recordAudit(c, {
			action: "banner.created",
			resourceType: "banner",
			resourceId: created.id,
			changes: { placement: created.placement, title: created.title },
		});

		return c.json(created, 201);
	},
);

adminCmsRoutes.patch(
	"/banners/:id",
	requirePermission(PERMISSIONS.content.write),
	validate("param", idParam),
	// Le contrôle « fin après début » ne s'applique que si les deux bornes sont
	// fournies ; le service le refait après fusion avec l'existant.
	validate("json", updateBannerSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const updated = await service.updateBanner(id, c.req.valid("json"));

		await recordAudit(c, {
			action: "banner.updated",
			resourceType: "banner",
			resourceId: id,
			changes: c.req.valid("json"),
		});

		return c.json(updated);
	},
);

adminCmsRoutes.delete(
	"/banners/:id",
	requirePermission(PERMISSIONS.content.write),
	validate("param", idParam),
	async (c) => {
		const { id } = c.req.valid("param");
		await service.deleteBanner(id);

		await recordAudit(c, {
			action: "banner.deleted",
			resourceType: "banner",
			resourceId: id,
		});

		return c.json({ success: true });
	},
);

adminCmsRoutes.get(
	"/pages",
	requirePermission(PERMISSIONS.content.read),
	validate("query", staticPageListQuerySchema),
	async (c) => c.json(await service.listStaticPages(c.req.valid("query"))),
);

adminCmsRoutes.post(
	"/pages",
	requirePermission(PERMISSIONS.content.write),
	validate("json", staticPageInputSchema),
	async (c) => {
		const created = await service.createStaticPage(c.req.valid("json"), currentUser(c).sub);

		await recordAudit(c, {
			action: "page.created",
			resourceType: "static_page",
			resourceId: created.id,
			changes: { slug: created.slug, title: created.title },
		});

		return c.json(created, 201);
	},
);

adminCmsRoutes.patch(
	"/pages/:id",
	requirePermission(PERMISSIONS.content.write),
	validate("param", idParam),
	validate("json", staticPageInputSchema.partial()),
	async (c) => {
		const { id } = c.req.valid("param");
		const updated = await service.updateStaticPage(
			id,
			c.req.valid("json"),
			currentUser(c).sub,
		);

		await recordAudit(c, {
			action: "page.updated",
			resourceType: "static_page",
			resourceId: id,
			changes: c.req.valid("json"),
		});

		return c.json(updated);
	},
);

adminCmsRoutes.delete(
	"/pages/:id",
	requirePermission(PERMISSIONS.content.write),
	validate("param", idParam),
	async (c) => {
		const { id } = c.req.valid("param");
		await service.deleteStaticPage(id);

		await recordAudit(c, {
			action: "page.deleted",
			resourceType: "static_page",
			resourceId: id,
		});

		return c.json({ success: true });
	},
);

adminCmsRoutes.get(
	"/featured",
	requirePermission(PERMISSIONS.content.read),
	validate("query", z.object({ sectionKey: z.string().max(64).optional() })),
	async (c) =>
		c.json(
			// Résolu (nom du produit/de la catégorie), sans filtrer les entrées
			// désactivées ni les produits non publiés : l'admin doit pouvoir
			// retrouver et gérer une mise en avant quel que soit son état.
			await service.listFeaturedEntries(c.req.valid("query").sectionKey, {
				resolve: true,
				includeInactive: true,
				includeUnpublished: true,
			}),
		),
);

adminCmsRoutes.post(
	"/featured",
	requirePermission(PERMISSIONS.content.write),
	validate("json", featuredEntryInputSchema),
	async (c) => {
		const created = await service.createFeaturedEntry(c.req.valid("json"));

		await recordAudit(c, {
			action: "featured.created",
			resourceType: "featured_entry",
			resourceId: created.id,
			changes: { sectionKey: created.sectionKey, kind: created.kind },
		});

		return c.json(created, 201);
	},
);

adminCmsRoutes.patch(
	"/featured/:id",
	requirePermission(PERMISSIONS.content.write),
	validate("param", idParam),
	validate("json", updateFeaturedEntrySchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const updated = await service.updateFeaturedEntry(id, c.req.valid("json"));

		await recordAudit(c, {
			action: "featured.updated",
			resourceType: "featured_entry",
			resourceId: id,
			changes: c.req.valid("json"),
		});

		return c.json(updated);
	},
);

adminCmsRoutes.delete(
	"/featured/:id",
	requirePermission(PERMISSIONS.content.write),
	validate("param", idParam),
	async (c) => {
		const { id } = c.req.valid("param");
		await service.deleteFeaturedEntry(id);

		await recordAudit(c, {
			action: "featured.deleted",
			resourceType: "featured_entry",
			resourceId: id,
		});

		return c.json({ success: true });
	},
);

// --- Blocs de mise en avant --------------------------------------------------

adminCmsRoutes.get(
	"/highlights",
	requirePermission(PERMISSIONS.content.read),
	validate("query", contentHighlightListQuerySchema),
	async (c) => c.json(await service.listContentHighlights(c.req.valid("query"))),
);

adminCmsRoutes.post(
	"/highlights",
	requirePermission(PERMISSIONS.content.write),
	validate("json", contentHighlightInputSchema),
	async (c) => {
		const created = await service.createContentHighlight(c.req.valid("json"));

		await recordAudit(c, {
			action: "highlight.created",
			resourceType: "content_highlight",
			resourceId: created.id,
			changes: { sectionKey: created.sectionKey, title: created.title },
		});

		return c.json(created, 201);
	},
);

adminCmsRoutes.patch(
	"/highlights/:id",
	requirePermission(PERMISSIONS.content.write),
	validate("param", idParam),
	validate("json", updateContentHighlightSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const updated = await service.updateContentHighlight(id, c.req.valid("json"));

		await recordAudit(c, {
			action: "highlight.updated",
			resourceType: "content_highlight",
			resourceId: id,
			changes: c.req.valid("json"),
		});

		return c.json(updated);
	},
);

adminCmsRoutes.delete(
	"/highlights/:id",
	requirePermission(PERMISSIONS.content.write),
	validate("param", idParam),
	async (c) => {
		const { id } = c.req.valid("param");
		await service.deleteContentHighlight(id);

		await recordAudit(c, {
			action: "highlight.deleted",
			resourceType: "content_highlight",
			resourceId: id,
		});

		return c.json({ success: true });
	},
);

// --- Messages de contact ---------------------------------------------------

adminCmsRoutes.get(
	"/contact-messages",
	requirePermission(PERMISSIONS.content.read),
	validate("query", contactMessageListQuerySchema),
	async (c) => c.json(await service.listContactMessages(c.req.valid("query"))),
);

adminCmsRoutes.patch(
	"/contact-messages/:id",
	requirePermission(PERMISSIONS.content.write),
	validate("param", idParam),
	validate("json", updateContactMessageSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const { status } = c.req.valid("json");

		const updated = await service.updateContactMessageStatus(id, status);

		await recordAudit(c, {
			action: "contact_message.status_changed",
			resourceType: "contact_message",
			resourceId: id,
			changes: { status },
		});

		return c.json(updated);
	},
);

// --- Storefront ------------------------------------------------------------

/** Contenu public : uniquement ce qui est publié et dans sa fenêtre de diffusion. */
export const storeCmsRoutes = new Hono<AppEnv>();

storeCmsRoutes.get(
	"/banners",
	validate("query", z.object({ placement: z.enum(BANNER_PLACEMENTS).optional() })),
	async (c) => c.json(await service.listPublicBanners(c.req.valid("query").placement)),
);

storeCmsRoutes.get("/pages/:slug", validate("param", slugParam), async (c) =>
	c.json(await service.getStaticPageBySlug(c.req.valid("param").slug, { publishedOnly: true })),
);

storeCmsRoutes.get(
	"/featured",
	validate("query", z.object({ sectionKey: z.string().max(64).optional() })),
	async (c) =>
		c.json(
			await service.listFeaturedEntries(c.req.valid("query").sectionKey, { resolve: true }),
		),
);

storeCmsRoutes.get(
	"/highlights",
	validate("query", z.object({ sectionKey: z.string().min(1).max(64) })),
	async (c) =>
		c.json(await service.listPublicContentHighlights(c.req.valid("query").sectionKey)),
);

/**
 * Réception d'un message du formulaire de contact.
 *
 * Publique par nature. Le champ leurre `website` filtre les robots les plus
 * simples : rempli, l'envoi est accepté en apparence mais rien n'est
 * enregistré - lui répondre par une erreur lui apprendrait comment passer.
 */
storeCmsRoutes.post(
	"/contact",
	validate("json", contactMessageInputSchema),
	async (c) => {
		const input = c.req.valid("json");

		if (input.website) return c.json({ success: true }, 201);

		const created = await service.createContactMessage(input, {
			ipAddress: c.get("clientIp"),
			userAgent: c.get("userAgent"),
		});

		return c.json({ success: true, id: created.id }, 201);
	},
);
