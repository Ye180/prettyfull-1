import { PERMISSIONS, promoCodeInputSchema, promoCodeListQuerySchema, updatePromoCodeSchema, } from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { recordAudit } from "../../lib/audit.js";
import { requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as service from "./service.js";
const idParam = z.object({ id: z.uuid() });
/** Module « Codes promo » du back-office (§2.9, §4.7). */
export const adminPromotionsRoutes = new Hono();
adminPromotionsRoutes.get("/promo-codes", requirePermission(PERMISSIONS.promotions.read), validate("query", promoCodeListQuerySchema), async (c) => c.json(await service.listPromoCodes(c.req.valid("query"))));
adminPromotionsRoutes.get("/promo-codes/:id", requirePermission(PERMISSIONS.promotions.read), validate("param", idParam), async (c) => c.json(await service.getPromoCode(c.req.valid("param").id)));
adminPromotionsRoutes.post("/promo-codes", requirePermission(PERMISSIONS.promotions.write), validate("json", promoCodeInputSchema), async (c) => {
    const created = await service.createPromoCode(c.req.valid("json"));
    await recordAudit(c, {
        action: "promo_code.created",
        resourceType: "promo_code",
        resourceId: created.id,
        changes: {
            code: created.code,
            discountType: created.discountType,
            discountValue: created.discountValue,
        },
    });
    return c.json(created, 201);
});
adminPromotionsRoutes.patch("/promo-codes/:id", requirePermission(PERMISSIONS.promotions.write), validate("param", idParam), validate("json", updatePromoCodeSchema), async (c) => {
    const { id } = c.req.valid("param");
    const updated = await service.updatePromoCode(id, c.req.valid("json"));
    await recordAudit(c, {
        action: "promo_code.updated",
        resourceType: "promo_code",
        resourceId: id,
        changes: c.req.valid("json"),
    });
    return c.json(updated);
});
adminPromotionsRoutes.delete("/promo-codes/:id", requirePermission(PERMISSIONS.promotions.write), validate("param", idParam), async (c) => {
    const { id } = c.req.valid("param");
    await service.deletePromoCode(id);
    await recordAudit(c, {
        action: "promo_code.deleted",
        resourceType: "promo_code",
        resourceId: id,
    });
    return c.json({ success: true });
});
//# sourceMappingURL=routes.js.map