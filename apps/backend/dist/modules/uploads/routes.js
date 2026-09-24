import { PERMISSIONS } from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { UTApi } from "uploadthing/server";
import { createRouteHandler } from "uploadthing/server";
import { env } from "../../lib/env.js";
import { badRequest, internalError } from "../../lib/errors.js";
import { recordAudit } from "../../lib/audit.js";
import { requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { uploadRouter } from "./router.js";
/**
 * Montage des routes de téléversement.
 *
 * Le jeton UploadThing est facultatif : sans lui, l'API démarre normalement et
 * ces routes répondent un message explicite plutôt que de faire échouer le
 * boot. Un projet doit pouvoir tourner en local sans compte de stockage.
 */
const isConfigured = Boolean(env.UPLOADTHING_TOKEN);
export const uploadthingRoutes = new Hono();
if (isConfigured) {
    const handlers = createRouteHandler({
        router: uploadRouter,
        config: {
            token: env.UPLOADTHING_TOKEN,
            isDev: env.NODE_ENV === "development",
        },
    });
    // UploadThing gère lui-même GET et POST sur ce chemin ; on lui passe la
    // requête brute, sa signature d'échange en dépend.
    uploadthingRoutes.all("/", (c) => handlers(c.req.raw));
}
else {
    uploadthingRoutes.all("/", (c) => c.json({
        error: {
            code: "UPLOAD_NOT_CONFIGURED",
            message: "Le stockage des visuels n'est pas configuré. Renseignez UPLOADTHING_TOKEN côté API.",
        },
    }, 503));
}
/** Routes d'administration des fichiers, montées sous `/api/admin`. */
export const adminUploadRoutes = new Hono();
/**
 * Indique au panel si le téléversement est disponible.
 *
 * Permet d'afficher le champ d'URL manuelle en repli plutôt qu'un bouton qui
 * échouerait au clic.
 */
adminUploadRoutes.get("/uploads/status", (c) => c.json({ configured: isConfigured }));
/**
 * Suppression d'un fichier téléversé.
 *
 * Retirer un visuel d'un produit ne libère rien côté stockage : sans cette
 * route, le quota se remplirait de fichiers que plus rien ne référence.
 */
adminUploadRoutes.delete("/uploads/:key", requirePermission(PERMISSIONS.catalog.write), validate("param", z.object({ key: z.string().min(8).max(200) })), async (c) => {
    if (!isConfigured)
        throw badRequest("Le stockage des visuels n'est pas configuré.");
    const { key } = c.req.valid("param");
    try {
        await new UTApi({ token: env.UPLOADTHING_TOKEN }).deleteFiles(key);
    }
    catch (error) {
        console.error("[upload] suppression impossible", key, error);
        throw internalError("Le fichier n'a pas pu être supprimé du stockage.");
    }
    await recordAudit(c, {
        action: "upload.deleted",
        resourceType: "upload",
        resourceId: key,
    });
    return c.json({ success: true });
});
//# sourceMappingURL=routes.js.map