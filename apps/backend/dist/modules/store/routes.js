import { Hono } from "hono";
import { listAvailablePaymentOptions } from "../integrations/service.js";
import { getStoreSettings } from "../settings/service.js";
/**
 * Points d'entrée transverses du storefront : configuration publique de la
 * boutique et moyens de paiement disponibles.
 *
 * Aucune clé d'agrégateur n'y transite — seulement ce que la cliente doit
 * voir pour choisir son mode de paiement.
 */
export const storeMiscRoutes = new Hono();
storeMiscRoutes.get("/payment-options", async (c) => c.json(await listAvailablePaymentOptions()));
/** Devises, langues et nom de la boutique, consommés au premier rendu. */
storeMiscRoutes.get("/config", async (c) => {
    const settings = await getStoreSettings();
    return c.json({
        storeName: settings.storeName,
        contactEmail: settings.contactEmail,
        supportPhone: settings.supportPhone ?? null,
        defaultCurrency: settings.defaultCurrency,
        enabledCurrencies: settings.enabledCurrencies,
        defaultLocale: settings.defaultLocale,
        enabledLocales: settings.enabledLocales,
        freeShippingThreshold: settings.freeShippingThreshold ?? null,
        maintenanceMode: settings.maintenanceMode,
    });
});
//# sourceMappingURL=routes.js.map