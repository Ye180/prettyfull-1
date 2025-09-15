//Path in english 

const ROOTS = {
      auth : "/auth",
      produit : "/produit",
      collections : "/collections",

}


export const paths = {
    home : "/",
    about : "/about",
    help : "/help",
    search : "/search",
    wishlist : "/wishlist",
    profile : "/profile",
    cart : "/cart",
    collection : "/collection",
    contact : "/contact",
    terms : "/terms",
    privacy : "/privacy",
    ...ROOTS
}

export const AUTH_PATHS = {
    login : ROOTS.auth + "/login",
    register : ROOTS.auth + "/register",
    forgotPassword : ROOTS.auth + "/forgot-password",
    resetPassword : ROOTS.auth + "/reset-password",
    verifyEmail : ROOTS.auth + "/verify-email",
}

export const PRODUCT_PATHS = {
    productList : ROOTS.produit,
    productDetail : (id: string) => `${ROOTS.produit}/${id}`,
    newProduct : ROOTS.produit + "/new",
    editProduct : (id: string) => `${ROOTS.produit}/${id}/edit`,
}

export const COLLECTION_PATHS = {
    collectionList : ROOTS.collections,
    collectionDetail : (id: string) => `${ROOTS.collections}/${id}`,
    newCollection : ROOTS.collections + "/new",
    editCollection : (id: string) => `${ROOTS.collections}/${id}/edit`,
}