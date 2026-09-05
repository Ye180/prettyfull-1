/**
 * Accès aux données du storefront.
 *
 * Point d'entrée unique : les vues et les hooks passent par ici, jamais
 * directement par `fetch`. C'est ce qui a permis de basculer des données
 * statiques vers l'API réelle sans toucher aux composants.
 */
export * from "./types";
export * from "./client";
export * from "./adapters";
export * from "./queries";
export * from "./cart";
