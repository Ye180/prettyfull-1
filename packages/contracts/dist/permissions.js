import { ROLE_KEYS } from "./enums.js";
/**
 * Catalogue des permissions du back-office, au format `<module>.<action>`.
 *
 * C'est la granularité exigée au §5 (« gestion fine des permissions par rôle »)
 * et ce qui rend vérifiable le critère d'acceptation §7 : un gestionnaire
 * catalogue ne doit pas atteindre la configuration des agrégateurs.
 */
export const PERMISSIONS = {
    dashboard: {
        read: "dashboard.read",
    },
    catalog: {
        read: "catalog.read",
        write: "catalog.write",
        delete: "catalog.delete",
        import: "catalog.import",
    },
    inventory: {
        read: "inventory.read",
        adjust: "inventory.adjust",
    },
    orders: {
        read: "orders.read",
        write: "orders.write",
        refund: "orders.refund",
    },
    customers: {
        read: "customers.read",
        write: "customers.write",
    },
    integrations: {
        read: "integrations.read",
        write: "integrations.write",
    },
    content: {
        read: "content.read",
        write: "content.write",
    },
    promotions: {
        read: "promotions.read",
        write: "promotions.write",
    },
    staff: {
        read: "staff.read",
        write: "staff.write",
    },
    settings: {
        read: "settings.read",
        write: "settings.write",
    },
    audit: {
        read: "audit.read",
    },
};
/** Toutes les permissions à plat - sert au seed de la table `permissions`. */
export const ALL_PERMISSIONS = Object.values(PERMISSIONS).flatMap((module) => Object.values(module));
/**
 * Permissions attachées à chaque rôle système.
 *
 * `super_admin` reçoit tout, y compris les permissions ajoutées plus tard :
 * ne jamais lui construire une liste figée.
 */
export const ROLE_PERMISSIONS = {
    super_admin: ALL_PERMISSIONS,
    catalog_manager: [
        PERMISSIONS.dashboard.read,
        PERMISSIONS.catalog.read,
        PERMISSIONS.catalog.write,
        PERMISSIONS.catalog.delete,
        PERMISSIONS.catalog.import,
        PERMISSIONS.inventory.read,
        PERMISSIONS.inventory.adjust,
        PERMISSIONS.content.read,
        PERMISSIONS.content.write,
        PERMISSIONS.promotions.read,
        PERMISSIONS.promotions.write,
    ],
    order_manager: [
        PERMISSIONS.dashboard.read,
        PERMISSIONS.catalog.read,
        PERMISSIONS.inventory.read,
        PERMISSIONS.orders.read,
        PERMISSIONS.orders.write,
        PERMISSIONS.orders.refund,
        PERMISSIONS.customers.read,
        PERMISSIONS.promotions.read,
    ],
    support: [
        PERMISSIONS.dashboard.read,
        PERMISSIONS.catalog.read,
        PERMISSIONS.orders.read,
        PERMISSIONS.customers.read,
    ],
};
/** Libellés affichés dans le panel (§4.8 « Utilisateurs & rôles »). */
export const ROLE_LABELS = {
    super_admin: "Super administrateur",
    catalog_manager: "Gestionnaire catalogue",
    order_manager: "Gestionnaire commandes",
    support: "Support client",
};
export const ROLE_DESCRIPTIONS = {
    super_admin: "Accès complet, y compris la configuration des agrégateurs.",
    catalog_manager: "Gère produits, catégories, variantes, stocks, contenu et codes promo.",
    order_manager: "Gère les commandes, remboursements et fiches clients.",
    support: "Consultation seule du catalogue, des commandes et des clients.",
};
export const SYSTEM_ROLES = ROLE_KEYS;
//# sourceMappingURL=permissions.js.map