import { addressInputSchema } from "@prettyfull/contracts";
import { and, asc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { notFound } from "../../lib/errors.js";
import { currentUser, requireAuth, requireKind } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
/**
 * Carnet d'adresses de la cliente (§2.7).
 *
 * Toutes les routes filtrent sur l'identité du jeton : une adresse n'est
 * jamais adressable par son seul identifiant, sinon deviner un UUID
 * suffirait à lire le domicile d'une autre cliente.
 */
const idParam = z.object({ id: z.uuid() });
const toAddress = (row) => ({
    id: row.id,
    firstName: row.firstName,
    lastName: row.lastName,
    company: row.company,
    address1: row.address1,
    address2: row.address2,
    city: row.city,
    postalCode: row.postalCode,
    province: row.province,
    countryCode: row.countryCode,
    phone: row.phone,
    isDefaultShipping: row.isDefaultShipping,
    isDefaultBilling: row.isDefaultBilling,
});
/**
 * Une seule adresse par défaut à la fois : marquer la nouvelle retire le
 * drapeau des autres, sinon le tunnel d'achat en trouverait plusieurs et en
 * choisirait une au hasard.
 */
const clearDefaults = async (userId, input, exceptId) => {
    if (!input.isDefaultShipping && !input.isDefaultBilling)
        return;
    const rows = await db
        .select({ id: t.addresses.id })
        .from(t.addresses)
        .where(eq(t.addresses.userId, userId));
    for (const row of rows) {
        if (row.id === exceptId)
            continue;
        await db
            .update(t.addresses)
            .set({
            ...(input.isDefaultShipping ? { isDefaultShipping: false } : {}),
            ...(input.isDefaultBilling ? { isDefaultBilling: false } : {}),
        })
            .where(eq(t.addresses.id, row.id));
    }
};
export const storeAddressRoutes = new Hono();
storeAddressRoutes.use("*", requireAuth, requireKind("customer"));
storeAddressRoutes.get("/addresses", async (c) => {
    const rows = await db
        .select()
        .from(t.addresses)
        .where(eq(t.addresses.userId, currentUser(c).sub))
        .orderBy(asc(t.addresses.createdAt));
    return c.json(rows.map(toAddress));
});
storeAddressRoutes.post("/addresses", validate("json", addressInputSchema), async (c) => {
    const userId = currentUser(c).sub;
    const input = c.req.valid("json");
    await clearDefaults(userId, input);
    const [created] = await db
        .insert(t.addresses)
        .values({
        userId,
        firstName: input.firstName,
        lastName: input.lastName,
        company: input.company ?? null,
        address1: input.address1,
        address2: input.address2 ?? null,
        city: input.city,
        postalCode: input.postalCode ?? null,
        province: input.province ?? null,
        countryCode: input.countryCode,
        phone: input.phone ?? null,
        isDefaultShipping: input.isDefaultShipping,
        isDefaultBilling: input.isDefaultBilling,
    })
        .returning();
    return c.json(toAddress(created), 201);
});
storeAddressRoutes.patch("/addresses/:id", validate("param", idParam), validate("json", addressInputSchema.partial()), async (c) => {
    const userId = currentUser(c).sub;
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    await clearDefaults(userId, {
        isDefaultShipping: input.isDefaultShipping ?? false,
        isDefaultBilling: input.isDefaultBilling ?? false,
    }, id);
    const patch = Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
    const [updated] = await db
        .update(t.addresses)
        .set({ ...patch, updatedAt: new Date() })
        .where(and(eq(t.addresses.id, id), eq(t.addresses.userId, userId)))
        .returning();
    if (!updated)
        throw notFound("Adresse");
    return c.json(toAddress(updated));
});
storeAddressRoutes.delete("/addresses/:id", validate("param", idParam), async (c) => {
    const [deleted] = await db
        .delete(t.addresses)
        .where(and(eq(t.addresses.id, c.req.valid("param").id), eq(t.addresses.userId, currentUser(c).sub)))
        .returning({ id: t.addresses.id });
    if (!deleted)
        throw notFound("Adresse");
    return c.json({ success: true });
});
//# sourceMappingURL=addresses.js.map