import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy d'authentification (ex-"middleware" — convention renommée en `proxy`
 * dans Next.js 16).
 *
 * NOTE : l'ancien fichier `routing-intl.middleware.ts` n'était jamais exécuté
 * (mauvais nom de fichier). Il faisait aussi du préfixage de locale
 * (`/en`, `/fr`) qui casserait le routing actuel — l'App Router n'a aucun
 * segment `[locale]`. On ne garde donc ici que la protection des routes.
 */

// Routes nécessitant une authentification
const protectedRoutes = ["/account", "/wishlist", "/checkout"];
// Routes d'authentification (login/inscription)
const authRoutes = ["/login", "/create-account"];

/**
 * Détecte la présence du cookie de rafraîchissement du storefront.
 *
 * `pf_store_refresh` est le cookie httpOnly posé par le backend (voir
 * `apps/backend/src/lib/cookies.ts`) lors du login/register/refresh - ce
 * proxy vérifiait auparavant `better-auth.session_token`, un nom hérité
 * d'une lib d'auth abandonnée que le backend ne pose jamais, ce qui faisait
 * traiter toute cliente connectée comme anonyme (boucle de redirection vers
 * `/login`).
 */
function hasSession(request: NextRequest): boolean {
  return Boolean(request.cookies.get("pf_store_refresh")?.value);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasSession(request);

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Connecté sur une page d'auth → renvoyer vers le compte
  if (authenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // Non connecté sur une route protégée → renvoyer vers le login
  if (!authenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // On ne fait tourner le middleware que sur les routes concernées
  matcher: [
    "/account/:path*",
    "/wishlist/:path*",
    "/checkout/:path*",
    "/login",
    "/create-account",
  ],
};
