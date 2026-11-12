import { PwaProvider } from "@/features/pwa";
import { JsonLd } from "@/lib/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo/schema";
import {
	IS_INDEXABLE,
	OG_DEFAULT_IMAGE,
	SITE_DESCRIPTION,
	SITE_KEYWORDS,
	SITE_LOCALE,
	SITE_NAME,
	SITE_TAGLINE,
	SITE_URL,
	SOCIAL_HANDLE,
} from "@/lib/seo/site";
import SmoothScroll from "@/shared/components/molecules/core/smooth-scroll";
import { Provider } from "@/shared/store/provider";
import { Toaster } from "@prettyfull/ui";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "../styles/globals.css"; // Assurez-vous que vos styles sont bien importés

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${SITE_NAME} : ${SITE_TAGLINE}`,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	keywords: SITE_KEYWORDS,
	applicationName: SITE_NAME,
	authors: [{ name: SITE_NAME, url: SITE_URL }],
	creator: SITE_NAME,
	publisher: SITE_NAME,
	openGraph: {
		type: "website",
		siteName: SITE_NAME,
		locale: SITE_LOCALE,
		url: SITE_URL,
		title: `${SITE_NAME} : ${SITE_TAGLINE}`,
		description: SITE_DESCRIPTION,
		images: [OG_DEFAULT_IMAGE],
	},
	twitter: {
		card: "summary_large_image",
		site: SOCIAL_HANDLE,
		title: `${SITE_NAME} : ${SITE_TAGLINE}`,
		description: SITE_DESCRIPTION,
		images: [OG_DEFAULT_IMAGE.url],
	},
	// Dev et staging ne doivent jamais être indexés (voir lib/seo/site.ts).
	robots: IS_INDEXABLE
		? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }
		: { index: false, follow: false },
	// Renseigner après avoir ajouté le site dans Google Search Console.
	verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
		? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
		: undefined,
	// iOS : ouverture plein écran depuis l'écran d'accueil (le manifeste ne
	// suffit pas sur les anciennes versions de Safari).
	appleWebApp: {
		capable: true,
		title: SITE_NAME,
		statusBarStyle: "default",
	},
	formatDetection: { telephone: false },
};

export const viewport: Viewport = {
	themeColor: "#ffffff",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const locale = await getLocale();

	return (
		<html lang={locale}>
			<body>
				<JsonLd data={[organizationSchema(), websiteSchema()]} />
				<Provider>
					<NextIntlClientProvider>
						<SmoothScroll>{children}</SmoothScroll>
						<PwaProvider />
					</NextIntlClientProvider>
					<Toaster position="top-right" />
				</Provider>
			</body>
		</html>
	);
}
