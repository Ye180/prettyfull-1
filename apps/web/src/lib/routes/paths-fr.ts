// Chemins en français

const ROOTS = {
    auth: "/auth",
    produit: "/produit",
    collections: "/collections",
}

export const chemins = {
    accueil: "/",
    apropos: "/a-propos",
    aide: "/aide",
    recherche: "/recherche",
    favoris: "/favoris",
    profil: "/profil",
    panier: "/panier",
    collection: "/collection",
    contact: "/contact",
    conditions: "/conditions",
    confidentialite: "/confidentialite",
    shippingReturn: "/shipping-return",
    ...ROOTS
}

export const LIEN_AUTH = {
    connexion: ROOTS.auth + "/connexion",
    inscription: ROOTS.auth + "/inscription",
    motDePasseOublie: ROOTS.auth + "/mot-de-passe-oublie",
    reinitialiserMotDePasse: ROOTS.auth + "/reinitialiser-mot-de-passe",
    verifierEmail: ROOTS.auth + "/verifier-email",
}

export const LIEN_PRODUIT = {
    listeProduits: ROOTS.produit,
    detailProduit: (id: string) => `${ROOTS.produit}/${id}`,
    nouveauProduit: ROOTS.produit + "/nouveau",
    modifierProduit: (id: string) => `${ROOTS.produit}/${id}/modifier`,
}

export const LIEN_COLLECTION = {
    listeCollections: ROOTS.collections,
    detailCollection: (id: string) => `${ROOTS.collections}/${id}`,
    nouvelleCollection: ROOTS.collections + "/nouvelle",
    modifierCollection: (id: string) => `${ROOTS.collections}/${id}/modifier`,
}
