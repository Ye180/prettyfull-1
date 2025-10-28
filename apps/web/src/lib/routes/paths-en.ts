//Path in english 

const ROOTS = {
      auth : "/auth",
      products : "/products",
      collections : "/collections",

}


export const paths = {
    home : "/",
    about : "/about",
    help : "/help",
    search : "/search",
    wishlist : "/wishlist",
    account : "/account",
    cart : "/cart",
    checkout : "/checkout",
    collection: "/collection",
    faq: "/faq",
    contact : "/contact",
    terms : "/terms-and-conditions",
    shippingReturn: "/shipping-return",
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
    productList : ROOTS.products,
    productDetail : (id: string) => `${ROOTS.products}/${id}`,
    newProduct : ROOTS.products + "/new",
    editProduct : (id: string) => `${ROOTS.products}/${id}/edit`,
}

export const COLLECTION_PATHS = {
    collectionList : ROOTS.collections,
    collectionDetail : (id: string) => `${ROOTS.collections}/${id}`,
    newCollection : ROOTS.collections + "/new",
    editCollection : (id: string) => `${ROOTS.collections}/${id}/edit`,
}