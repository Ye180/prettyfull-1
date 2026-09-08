import { type RoleKey } from "./enums.js";
/**
 * Catalogue des permissions du back-office, au format `<module>.<action>`.
 *
 * C'est la granularité exigée au §5 (« gestion fine des permissions par rôle »)
 * et ce qui rend vérifiable le critère d'acceptation §7 : un gestionnaire
 * catalogue ne doit pas atteindre la configuration des agrégateurs.
 */
export declare const PERMISSIONS: {
    readonly dashboard: {
        readonly read: "dashboard.read";
    };
    readonly catalog: {
        readonly read: "catalog.read";
        readonly write: "catalog.write";
        readonly delete: "catalog.delete";
        readonly import: "catalog.import";
    };
    readonly inventory: {
        readonly read: "inventory.read";
        readonly adjust: "inventory.adjust";
    };
    readonly orders: {
        readonly read: "orders.read";
        readonly write: "orders.write";
        readonly refund: "orders.refund";
    };
    readonly customers: {
        readonly read: "customers.read";
        readonly write: "customers.write";
    };
    readonly integrations: {
        readonly read: "integrations.read";
        readonly write: "integrations.write";
    };
    readonly content: {
        readonly read: "content.read";
        readonly write: "content.write";
    };
    readonly staff: {
        readonly read: "staff.read";
        readonly write: "staff.write";
    };
    readonly settings: {
        readonly read: "settings.read";
        readonly write: "settings.write";
    };
    readonly audit: {
        readonly read: "audit.read";
    };
};
type PermissionTree = typeof PERMISSIONS;
export type PermissionModule = keyof PermissionTree;
/**
 * Union de toutes les permissions. Le mapping est distribué module par module :
 * un simple `PermissionTree[PermissionModule][keyof …]` s'effondrerait sur
 * l'intersection des clés (`read`), seule clé commune à tous les modules.
 */
export type Permission = {
    [M in PermissionModule]: PermissionTree[M][keyof PermissionTree[M]];
}[PermissionModule];
/** Toutes les permissions à plat — sert au seed de la table `permissions`. */
export declare const ALL_PERMISSIONS: Permission[];
/**
 * Permissions attachées à chaque rôle système.
 *
 * `super_admin` reçoit tout, y compris les permissions ajoutées plus tard :
 * ne jamais lui construire une liste figée.
 */
export declare const ROLE_PERMISSIONS: Record<RoleKey, readonly Permission[]>;
/** Libellés affichés dans le panel (§4.8 « Utilisateurs & rôles »). */
export declare const ROLE_LABELS: Record<RoleKey, string>;
export declare const ROLE_DESCRIPTIONS: Record<RoleKey, string>;
export declare const SYSTEM_ROLES: readonly ["super_admin", "catalog_manager", "order_manager", "support"];
export {};
//# sourceMappingURL=permissions.d.ts.map