import { ERROR_CODES } from "@prettyfull/contracts";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { AppError } from "../lib/errors.js";
import { isProduction } from "../lib/env.js";
/**
 * Regroupe les erreurs Zod par chemin de champ.
 * `{ "shippingAddress.city": ["Requis"] }` - directement exploitable par les
 * formulaires du back-office.
 */
const formatZodIssues = (error) => {
    const details = {};
    for (const issue of error.issues) {
        const path = issue.path.join(".") || "_";
        (details[path] ??= []).push(issue.message);
    }
    return details;
};
/**
 * Gestionnaire d'erreurs unique de l'API.
 *
 * Toute erreur inattendue est journalisée côté serveur puis renvoyée sous
 * forme générique : en production, aucun message d'exception ni trace n'est
 * exposé au client, seule la réponse enveloppée l'est.
 */
export const errorHandler = (error, c) => {
    if (error instanceof AppError) {
        return c.json({
            error: {
                code: error.code,
                message: error.message,
                ...(error.details ? { details: error.details } : {}),
            },
        }, error.status);
    }
    if (error instanceof ZodError) {
        return c.json({
            error: {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: "Les données envoyées sont invalides.",
                details: formatZodIssues(error),
            },
        }, 400);
    }
    if (error instanceof HTTPException) {
        return c.json({
            error: {
                code: error.status === 401 ? ERROR_CODES.UNAUTHORIZED : ERROR_CODES.VALIDATION_ERROR,
                message: error.message,
            },
        }, error.status);
    }
    console.error("[erreur non gérée]", c.req.method, c.req.path, error);
    return c.json({
        error: {
            code: ERROR_CODES.INTERNAL_ERROR,
            message: isProduction
                ? "Une erreur interne est survenue."
                : error instanceof Error
                    ? error.message
                    : String(error),
        },
    }, 500);
};
export const notFoundHandler = (c) => c.json({
    error: {
        code: ERROR_CODES.NOT_FOUND,
        message: `Route introuvable : ${c.req.method} ${c.req.path}`,
    },
}, 404);
//# sourceMappingURL=error.js.map