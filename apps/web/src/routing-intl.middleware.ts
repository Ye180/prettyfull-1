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

export function middleware(request: NextRequest) {
  // 1- check if the pathname have a locale
  const pathname = request.nextUrl.pathname;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  // 2- Redirect to default locale base on user preference
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/:path*"],
};
