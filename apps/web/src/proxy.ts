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
 * Détecte la présence d'un token de session Better Auth.
 * En production, le cookie peut être préfixé par `__Secure-`, on teste les deux
 * afin de ne jamais rediriger par erreur un utilisateur connecté.
 */
function hasSession(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value,
  );
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
