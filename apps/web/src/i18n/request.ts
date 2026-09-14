import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { cookies } from "next/headers";
import { routing } from "./routing";

// ponytail: next-intl's createMiddleware 404s every route under this
// project's Next 16 install (proxy/middleware convention mismatch) - no
// middleware means `requestLocale` never resolves, so we read the
// `NEXT_LOCALE` cookie directly instead (same cookie next-intl's own
// middleware would have set). Language switcher writes this cookie in
// currency-selector.tsx.
export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = hasLocale(routing.locales, cookieLocale)
    ? cookieLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../translations/${locale}.json`)).default,
  };
});
