/**
 * Contrats partagés PrettyFull.
 *
 * Un seul endroit décrit la forme des données : le backend s'en sert pour
 * valider les requêtes, le back-office pour valider ses formulaires, et le
 * storefront pour typer ses réponses. Le storefront peut n'importer que les
 * types (`import type`), sans embarquer Zod à l'exécution.
 */
export * from "./enums.js";
export * from "./permissions.js";
export * from "./common.js";
export * from "./auth.js";
export * from "./catalog.js";
export * from "./inventory.js";
export * from "./orders.js";
export * from "./integrations.js";
export * from "./cms.js";
export * from "./settings.js";
export * from "./dashboard.js";
//# sourceMappingURL=index.js.map