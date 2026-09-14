import { defineRouting } from 'next-intl/routing';

// ponytail: app/ has no [locale] segment (every route lives directly under
// app/(home)/... and app/(auth)/...) - a full URL-prefixed migration is a
// separate, much bigger project. localePrefix: "never" resolves the locale
// via cookie/Accept-Language and keeps every existing route working as-is.
export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  localePrefix: 'never',
});