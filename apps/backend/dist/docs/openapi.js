import { BANNER_PLACEMENTS, CURRENCY_CODES, MANUAL_STOCK_REASONS, ORDER_STATUSES, PAYMENT_STATUSES, PRODUCT_KINDS, STOCK_STATUSES, } from "@prettyfull/contracts";
import { env } from "../lib/env.js";
/**
 * Description OpenAPI de l'API PrettyFull (§5, « Documentation »).
 *
 * Rédigée à la main plutôt que dérivée des schémas Zod : la génération
 * automatique aurait imposé de réécrire chaque route avec `@hono/zod-openapi`,
 * ce qui alourdit le code métier pour un gain documentaire limité. Les
 * énumérations, elles, viennent des contrats — elles ne peuvent donc pas se
 * désynchroniser du modèle.
 */
const json = (schema) => ({
    content: { "application/json": { schema } },
});
const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const paginationParams = [
    { name: "page", in: "query", schema: { type: "integer", minimum: 1, default: 1 } },
    {
        name: "limit",
        in: "query",
        schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
    },
];
const errorResponses = {
    400: { description: "Données invalides", ...json(ref("ApiError")) },
    401: { description: "Authentification requise", ...json(ref("ApiError")) },
    403: { description: "Permission insuffisante", ...json(ref("ApiError")) },
    404: { description: "Ressource introuvable", ...json(ref("ApiError")) },
    409: { description: "Conflit métier (stock, transition, unicité)", ...json(ref("ApiError")) },
};
export const openApiDocument = {
    openapi: "3.1.0",
    info: {
        title: "API PrettyFull",
        version: "1.0.0",
        description: [
            "API e-commerce PrettyFull.",
            "",
            "## Deux surfaces",
            "",
            "- `/api/store/*` — publique, consommée par le storefront. Session cliente facultative.",
            "- `/api/admin/*` — back-office. Jeton d'un compte `staff` **et** permission vérifiée route par route.",
            "- `/api/webhooks/*` — notifications des agrégateurs, authentifiées par signature.",
            "",
            "## Authentification",
            "",
            "Le jeton d'accès (15 min) circule en en-tête `Authorization: Bearer`.",
            "Le jeton de rafraîchissement circule en cookie `httpOnly` + `SameSite=Strict`",
            "et **tourne à chaque usage** : rejouer un ancien jeton échoue.",
            "",
            "## Montants",
            "",
            "Tous les montants sont des **entiers exprimés dans la plus petite unité**",
            "de leur devise. Le franc CFA n'ayant pas de sous-unité, `58500` vaut",
            "58 500 FCFA ; en euros, `1500` vaudrait 15,00 €.",
            "",
            "## Stock",
            "",
            "Le stock est tenu au niveau le plus fin disponible : variante + taille,",
            "sinon taille, sinon variante, sinon produit. Une commande **réserve**",
            "le stock ; la décrémentation ferme intervient à la confirmation de paiement.",
        ].join("\n"),
    },
    servers: [{ url: env.PUBLIC_API_URL, description: "Instance courante" }],
    tags: [
        { name: "Authentification", description: "Sessions client et back-office." },
        { name: "Catalogue", description: "Produits, variantes, catégories." },
        { name: "Stocks", description: "Inventaire, ajustements, mouvements." },
        { name: "Panier & commande", description: "Tunnel d'achat du storefront." },
        { name: "Commandes", description: "Suivi et traitement en back-office." },
        { name: "Agrégateurs", description: "Paiement, livraison, transactions." },
        { name: "Contenu", description: "Bannières, pages statiques, mises en avant." },
        { name: "Administration", description: "Comptes, rôles, paramètres, audit." },
    ],
    components: {
        securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
        schemas: {
            ApiError: {
                type: "object",
                description: "Enveloppe d'erreur unique de l'API.",
                properties: {
                    error: {
                        type: "object",
                        properties: {
                            code: {
                                type: "string",
                                example: "INSUFFICIENT_STOCK",
                                description: "Code métier stable, exploitable par le client.",
                            },
                            message: { type: "string" },
                            details: {
                                type: "object",
                                description: "Erreurs par champ, pour les formulaires.",
                                additionalProperties: { type: "array", items: { type: "string" } },
                            },
                        },
                    },
                },
            },
            PaginationMeta: {
                type: "object",
                properties: {
                    page: { type: "integer" },
                    limit: { type: "integer" },
                    total: { type: "integer" },
                    totalPages: { type: "integer" },
                    hasNext: { type: "boolean" },
                    hasPrevious: { type: "boolean" },
                },
            },
            Money: {
                type: "integer",
                description: "Montant entier dans la plus petite unité de la devise (58500 = 58 500 FCFA).",
            },
            Product: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    kind: {
                        type: "string",
                        enum: [...PRODUCT_KINDS],
                        description: "`simple` : tailles portées par le produit. `variant` : tailles portées par les coloris. Les deux ne coexistent jamais.",
                    },
                    name: { type: "string" },
                    slug: { type: "string" },
                    basePrice: ref("Money"),
                    compareAtPrice: { ...ref("Money"), nullable: true },
                    currency: { type: "string", enum: [...CURRENCY_CODES] },
                    stockStatus: { type: "string", enum: [...STOCK_STATUSES] },
                    availableQuantity: { type: "integer" },
                    variants: { type: "array", items: ref("Variant") },
                    sizes: { type: "array", items: ref("Size") },
                },
            },
            Variant: {
                type: "object",
                description: "Déclinaison couleur, avec sa galerie et ses tailles.",
                properties: {
                    id: { type: "string", format: "uuid" },
                    name: { type: "string", example: "Noir" },
                    colorHex: { type: "string", nullable: true, example: "#111111" },
                    priceOverride: { ...ref("Money"), nullable: true },
                    sizes: { type: "array", items: ref("Size") },
                    availableQuantity: { type: "integer" },
                },
            },
            Size: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    label: { type: "string", example: "M" },
                    sku: { type: "string", nullable: true },
                    quantity: { type: "integer" },
                    availableQuantity: { type: "integer" },
                    stockStatus: { type: "string", enum: [...STOCK_STATUSES] },
                },
            },
            Order: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    displayId: { type: "integer", description: "Numéro lisible communiqué au client." },
                    status: { type: "string", enum: [...ORDER_STATUSES] },
                    paymentStatus: { type: "string", enum: [...PAYMENT_STATUSES] },
                    total: ref("Money"),
                    refundedTotal: ref("Money"),
                    items: {
                        type: "array",
                        description: "Instantané figé à l'achat : libellés et prix ne suivent pas les modifications ultérieures du catalogue.",
                        items: { type: "object" },
                    },
                },
            },
            InventoryRow: {
                type: "object",
                properties: {
                    id: { type: "string", format: "uuid" },
                    productName: { type: "string" },
                    variantName: { type: "string", nullable: true },
                    sizeLabel: { type: "string", nullable: true },
                    quantity: { type: "integer", description: "Stock physique, réservations comprises." },
                    reservedQuantity: {
                        type: "integer",
                        description: "Immobilisé par des paiements en cours.",
                    },
                    availableQuantity: { type: "integer", description: "quantity − reservedQuantity." },
                    stockStatus: { type: "string", enum: [...STOCK_STATUSES] },
                },
            },
        },
    },
    paths: {
        "/health": {
            get: {
                tags: ["Administration"],
                summary: "Sonde de disponibilité",
                security: [],
                responses: { 200: { description: "Service opérationnel" } },
            },
        },
        // --- Authentification ---
        "/api/store/auth/login": {
            post: {
                tags: ["Authentification"],
                summary: "Connexion cliente",
                description: "Un compte back-office est refusé ici, et réciproquement : les deux portails sont cloisonnés par le type de compte.",
                security: [],
                requestBody: json({
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email" },
                        password: { type: "string" },
                    },
                }),
                responses: {
                    200: { description: "Session ouverte ; cookie de rafraîchissement posé" },
                    ...errorResponses,
                },
            },
        },
        "/api/store/auth/register": {
            post: {
                tags: ["Authentification"],
                summary: "Inscription cliente",
                security: [],
                responses: { 201: { description: "Compte créé" }, ...errorResponses },
            },
        },
        "/api/admin/auth/login": {
            post: {
                tags: ["Authentification"],
                summary: "Connexion back-office",
                security: [],
                responses: {
                    200: { description: "Session ouverte, avec rôles et permissions" },
                    ...errorResponses,
                },
            },
        },
        "/api/admin/auth/refresh": {
            post: {
                tags: ["Authentification"],
                summary: "Renouvellement de session",
                description: "Le jeton présenté est révoqué et remplacé (rotation).",
                security: [],
                responses: { 200: { description: "Nouvelle session" }, ...errorResponses },
            },
        },
        // --- Catalogue public ---
        "/api/store/products": {
            get: {
                tags: ["Catalogue"],
                summary: "Catalogue publié",
                description: "Seuls les produits publiés sont servis : aucun paramètre ne permet d'atteindre un brouillon.",
                security: [],
                parameters: [
                    ...paginationParams,
                    { name: "q", in: "query", schema: { type: "string" }, description: "Recherche plein texte, insensible aux accents." },
                    { name: "categorySlug", in: "query", schema: { type: "string" } },
                    { name: "minPrice", in: "query", schema: { type: "integer" } },
                    { name: "maxPrice", in: "query", schema: { type: "integer" } },
                ],
                responses: {
                    200: {
                        description: "Page de produits",
                        ...json({
                            type: "object",
                            properties: {
                                data: { type: "array", items: ref("Product") },
                                meta: ref("PaginationMeta"),
                            },
                        }),
                    },
                },
            },
        },
        "/api/store/products/{slug}": {
            get: {
                tags: ["Catalogue"],
                summary: "Fiche produit",
                security: [],
                parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Produit", ...json(ref("Product")) }, ...errorResponses },
            },
        },
        "/api/store/categories": {
            get: {
                tags: ["Catalogue"],
                summary: "Rayons",
                security: [],
                parameters: [
                    { name: "tree", in: "query", schema: { type: "boolean" }, description: "Renvoie l'arbre complet plutôt qu'une page plate." },
                ],
                responses: { 200: { description: "Rayons actifs" } },
            },
        },
        "/api/store/categories/{slug}/products": {
            get: {
                tags: ["Catalogue"],
                summary: "Produits d'un rayon",
                description: "Le paramètre accepte un slug ou un identifiant. Les sous-rayons sont inclus.",
                security: [],
                parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
                responses: { 200: { description: "Page de produits" } },
            },
        },
        // --- Panier & commande ---
        "/api/store/cart": {
            get: {
                tags: ["Panier & commande"],
                summary: "Panier courant",
                description: "Panier de la cliente connectée, ou du visiteur via son cookie de panier.",
                security: [],
                responses: { 200: { description: "Panier" } },
            },
            delete: {
                tags: ["Panier & commande"],
                summary: "Vider le panier",
                security: [],
                responses: { 200: { description: "Panier vidé" } },
            },
        },
        "/api/store/cart/items": {
            post: {
                tags: ["Panier & commande"],
                summary: "Ajouter un article",
                description: "Le triplet produit/variante/taille désigne le point de stock. La disponibilité est vérifiée à l'ajout.",
                security: [],
                requestBody: json({
                    type: "object",
                    required: ["productId"],
                    properties: {
                        productId: { type: "string", format: "uuid" },
                        variantId: { type: "string", format: "uuid", nullable: true },
                        sizeId: { type: "string", format: "uuid", nullable: true },
                        quantity: { type: "integer", minimum: 1, default: 1 },
                    },
                }),
                responses: {
                    201: { description: "Panier mis à jour" },
                    ...errorResponses,
                    409: { description: "Stock insuffisant ; `details` porte le disponible réel", ...json(ref("ApiError")) },
                },
            },
        },
        "/api/store/cart/shipping-options": {
            get: {
                tags: ["Panier & commande"],
                summary: "Options de livraison",
                description: "Calculées par les adaptateurs de livraison actifs, d'après l'adresse et le poids du panier.",
                security: [],
                responses: { 200: { description: "Options disponibles" }, ...errorResponses },
            },
        },
        "/api/store/checkout": {
            post: {
                tags: ["Panier & commande"],
                summary: "Passer commande",
                description: [
                    "Réserve le stock **sous verrou** avant tout appel au prestataire :",
                    "si un article vient d'être épuisé, rien n'est créé.",
                    "",
                    "Renvoie `redirectUrl` quand le prestataire exige une page de paiement",
                    "hébergée, et `confirmationToken` pour consulter la commande sans compte.",
                ].join("\n"),
                security: [],
                responses: {
                    201: { description: "Commande créée" },
                    ...errorResponses,
                    409: { description: "Stock insuffisant", ...json(ref("ApiError")) },
                },
            },
        },
        "/api/store/orders/{id}/confirmation": {
            get: {
                tags: ["Panier & commande"],
                summary: "Confirmation d'une commande invité",
                description: "Le jeton signé renvoyé au passage en commande tient lieu d'autorisation.",
                security: [],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
                    { name: "token", in: "query", required: true, schema: { type: "string" } },
                ],
                responses: { 200: { description: "Commande", ...json(ref("Order")) }, ...errorResponses },
            },
        },
        // --- Back-office ---
        "/api/admin/dashboard": {
            get: {
                tags: ["Administration"],
                summary: "Tableau de bord",
                description: "Permission `dashboard.read`. Ne comptabilise que les commandes payées.",
                parameters: [{ name: "period", in: "query", schema: { type: "integer", default: 30 } }],
                responses: { 200: { description: "Indicateurs et alertes" }, ...errorResponses },
            },
        },
        "/api/admin/products": {
            get: {
                tags: ["Catalogue"],
                summary: "Liste des produits",
                description: "Permission `catalog.read`.",
                parameters: paginationParams,
                responses: { 200: { description: "Page de produits" }, ...errorResponses },
            },
            post: {
                tags: ["Catalogue"],
                summary: "Créer un produit",
                description: [
                    "Permission `catalog.write`.",
                    "",
                    "La règle de cohérence est appliquée : un produit `variant` ne peut pas",
                    "porter de tailles au niveau produit, et un produit `simple` ne peut pas",
                    "déclarer de variantes. Une violation renvoie `INVALID_PRODUCT_MODEL`.",
                ].join("\n"),
                responses: {
                    201: { description: "Produit créé", ...json(ref("Product")) },
                    ...errorResponses,
                    422: { description: "Modèle de produit incohérent", ...json(ref("ApiError")) },
                },
            },
        },
        "/api/admin/products/export": {
            get: {
                tags: ["Catalogue"],
                summary: "Export CSV",
                description: "Une ligne par point de stock. Permission `catalog.read`.",
                responses: { 200: { description: "Fichier CSV" }, ...errorResponses },
            },
        },
        "/api/admin/products/import": {
            post: {
                tags: ["Catalogue"],
                summary: "Import CSV",
                description: "Permission `catalog.import`. `dryRun` simule sans rien écrire.",
                responses: { 200: { description: "Rapport d'import" }, ...errorResponses },
            },
        },
        "/api/admin/inventory": {
            get: {
                tags: ["Stocks"],
                summary: "Vue consolidée des stocks",
                description: "Permission `inventory.read`.",
                parameters: [
                    ...paginationParams,
                    { name: "lowStockOnly", in: "query", schema: { type: "boolean" } },
                    { name: "stockStatus", in: "query", schema: { type: "string", enum: [...STOCK_STATUSES] } },
                ],
                responses: {
                    200: {
                        description: "Points de stock",
                        ...json({
                            type: "object",
                            properties: {
                                data: { type: "array", items: ref("InventoryRow") },
                                meta: ref("PaginationMeta"),
                            },
                        }),
                    },
                    ...errorResponses,
                },
            },
        },
        "/api/admin/inventory/adjust": {
            post: {
                tags: ["Stocks"],
                summary: "Ajustement manuel",
                description: [
                    "Permission `inventory.adjust`.",
                    "",
                    "Le motif est **obligatoire** : chaque ajustement produit une ligne au",
                    "journal des mouvements, avec son auteur. Un retrait supérieur au stock,",
                    "ou empiétant sur les réservations, est refusé.",
                ].join("\n"),
                requestBody: json({
                    type: "object",
                    required: ["inventoryItemId", "delta", "reason"],
                    properties: {
                        inventoryItemId: { type: "string", format: "uuid" },
                        delta: { type: "integer", description: "Signé. `-3` pour une casse." },
                        reason: { type: "string", enum: [...MANUAL_STOCK_REASONS] },
                        note: { type: "string" },
                    },
                }),
                responses: {
                    200: { description: "Quantités avant et après" },
                    ...errorResponses,
                    409: { description: "Stock insuffisant", ...json(ref("ApiError")) },
                },
            },
        },
        "/api/admin/inventory/movements": {
            get: {
                tags: ["Stocks"],
                summary: "Journal des mouvements",
                description: "Permission `inventory.read`. Journal en lecture seule.",
                parameters: paginationParams,
                responses: { 200: { description: "Mouvements" }, ...errorResponses },
            },
        },
        "/api/admin/orders": {
            get: {
                tags: ["Commandes"],
                summary: "Liste des commandes",
                description: "Permission `orders.read`. La recherche accepte un numéro, un e-mail ou un suivi.",
                parameters: paginationParams,
                responses: { 200: { description: "Page de commandes" }, ...errorResponses },
            },
        },
        "/api/admin/orders/{id}/status": {
            patch: {
                tags: ["Commandes"],
                summary: "Changer le statut",
                description: "Permission `orders.write`. Seules les transitions autorisées passent ; annuler libère les réservations et remet en stock ce qui avait été décrémenté.",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: {
                    200: { description: "Commande mise à jour", ...json(ref("Order")) },
                    ...errorResponses,
                    409: { description: "Transition interdite", ...json(ref("ApiError")) },
                },
            },
        },
        "/api/admin/orders/{id}/refund": {
            post: {
                tags: ["Commandes"],
                summary: "Rembourser",
                description: "Permission `orders.refund`. Total ou partiel, avec remise en stock optionnelle. Le prestataire est sollicité avant toute écriture.",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: { 200: { description: "Commande mise à jour" }, ...errorResponses },
            },
        },
        "/api/admin/orders/{id}/invoice": {
            get: {
                tags: ["Commandes"],
                summary: "Facture",
                description: "Permission `orders.read`. HTML imprimable en PDF depuis le navigateur.",
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
                responses: { 200: { description: "Document HTML" }, ...errorResponses },
            },
        },
        "/api/admin/integrations/payment": {
            get: {
                tags: ["Agrégateurs"],
                summary: "Agrégateurs de paiement",
                description: "Permission `integrations.read`. Les clés ne sont **jamais** renvoyées : seule la liste des clés renseignées l'est.",
                responses: { 200: { description: "Configurations" }, ...errorResponses },
            },
        },
        "/api/admin/integrations/payment/{key}": {
            patch: {
                tags: ["Agrégateurs"],
                summary: "Configurer / activer",
                description: "Permission `integrations.write`. L'activation est refusée tant qu'une clé obligatoire manque.",
                parameters: [{ name: "key", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Configuration mise à jour" },
                    ...errorResponses,
                    409: { description: "Clés manquantes", ...json(ref("ApiError")) },
                },
            },
        },
        "/api/webhooks/{provider}": {
            post: {
                tags: ["Agrégateurs"],
                summary: "Notification d'un prestataire",
                description: [
                    "Authentifiée par la signature du prestataire, jamais par un jeton.",
                    "",
                    "Trois garanties : signature vérifiée, idempotence sur",
                    "`(prestataire, identifiant d'événement)`, et contrôle du montant notifié",
                    "contre le total de la commande.",
                ].join("\n"),
                security: [],
                parameters: [{ name: "provider", in: "path", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Événement pris en compte (ou déjà connu)" },
                    400: { description: "Signature invalide" },
                    409: { description: "Montant divergent" },
                },
            },
        },
        "/api/admin/banners": {
            get: {
                tags: ["Contenu"],
                summary: "Bannières",
                description: "Permission `content.read`.",
                parameters: [
                    ...paginationParams,
                    { name: "placement", in: "query", schema: { type: "string", enum: [...BANNER_PLACEMENTS] } },
                ],
                responses: { 200: { description: "Bannières" }, ...errorResponses },
            },
        },
        "/api/admin/audit-logs": {
            get: {
                tags: ["Administration"],
                summary: "Journal d'activité",
                description: "Permission `audit.read`. Trace des actions sensibles (§5).",
                parameters: paginationParams,
                responses: { 200: { description: "Entrées du journal" }, ...errorResponses },
            },
        },
    },
    security: [{ bearerAuth: [] }],
};
//# sourceMappingURL=openapi.js.map