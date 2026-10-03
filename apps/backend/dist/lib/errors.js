import { ERROR_CODES } from "@prettyfull/contracts";
/**
 * Erreur applicative portant son code métier et son statut HTTP.
 *
 * Les services lèvent ces erreurs plutôt que de construire des réponses :
 * le gestionnaire global les traduit en une enveloppe unique, et toute erreur
 * non typée devient un 500 générique sans fuite de détail interne.
 */
export class AppError extends Error {
    code;
    status;
    details;
    constructor(code, message, status, details) {
        super(message);
        this.name = "AppError";
        this.code = code;
        this.status = status;
        this.details = details;
    }
}
export const badRequest = (message, details) => new AppError(ERROR_CODES.VALIDATION_ERROR, message, 400, details);
export const unauthorized = (message = "Authentification requise.") => new AppError(ERROR_CODES.UNAUTHORIZED, message, 401);
export const forbidden = (message = "Accès refusé.") => new AppError(ERROR_CODES.FORBIDDEN, message, 403);
export const notFound = (resource = "Ressource") => new AppError(ERROR_CODES.NOT_FOUND, `${resource} introuvable.`, 404);
export const conflict = (message, details) => new AppError(ERROR_CODES.CONFLICT, message, 409, details);
/**
 * Stock insuffisant. `details` porte le disponible réel pour que le panier du
 * storefront puisse ajuster la quantité sans second aller-retour.
 */
export const insufficientStock = (message, details) => new AppError(ERROR_CODES.INSUFFICIENT_STOCK, message, 409, details);
/** Violation de la règle de cohérence simple / à variantes (§2.2). */
export const invalidProductModel = (message) => new AppError(ERROR_CODES.INVALID_PRODUCT_MODEL, message, 422);
export const paymentError = (message, details) => new AppError(ERROR_CODES.PAYMENT_ERROR, message, 402, details);
export const providerError = (message) => new AppError(ERROR_CODES.PROVIDER_ERROR, message, 502);
export const internalError = (message = "Une erreur interne est survenue.") => new AppError(ERROR_CODES.INTERNAL_ERROR, message, 500);
//# sourceMappingURL=errors.js.map