import { NextRequest, NextResponse } from "next/server";

/**
 * To See more explanation about internationalized routing with Next.js go to :
 * https://nextjs.org/docs/app/guides/internationalization.
 * Thanks Buddys ! 😊
 * by Danmo
 */

const locales = ["en", "fr"] as const;
type Locale = (typeof locales)[number];

/**
 * Get the user's preferred locale from the Accept-Language header.
 * @param request The incoming request.
 * @returns The preferred locale or the default locale.
 */
function getLocale(request: NextRequest): Locale {
  // Get the user's preferred languages from the Accept-Language header
  const acceptLanguage = request.headers.get("Accept-Language");

  // Extract the first locale from the Accept-Language header
  const firstLocale = acceptLanguage?.split(",")[0]?.split("-")[0];
  if (firstLocale && locales.includes(firstLocale as Locale))
    return firstLocale as Locale; // fistlocal as default locale

  return locales[0]; // default locale
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get session token from cookies
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // Check if the pathname has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Extract the path without locale
  let pathWithoutLocale = pathname;
  if (pathnameHasLocale) {
    const locale = locales.find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );
    pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  }

  // Define protected routes that require authentication
  const protectedRoutes = ["/account", "/wishlist", "/checkout"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Define auth routes (login, register, etc.)
  const authRoutes = ["/login", "/create-account"];
  const isAuthRoute = authRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // If user is authenticated and trying to access auth pages, redirect to account
  if (sessionToken && isAuthRoute) {
    const locale = getLocale(request);
    const redirectUrl = new URL(`/${locale}/account`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!sessionToken && isProtectedRoute) {
    const locale = getLocale(request);
    const redirectUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If pathname doesn't have locale, redirect to default locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/:path*"],
};
