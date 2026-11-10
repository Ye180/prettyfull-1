import { PwaProvider } from "@/features/pwa";
import SmoothScroll from "@/shared/components/molecules/core/smooth-scroll";
import { Provider } from "@/shared/store/provider";
import { Toaster } from "@prettyfull/ui";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "../styles/globals.css"; // Assurez-vous que vos styles sont bien importés

export const metadata: Metadata = {
	title: {
		default: "Prettyfull",
		template: "%s | Prettyfull",
	},
	description: "Prettyfull - vitamines et compléments alimentaires en ligne.",
	applicationName: "Prettyfull",
	// iOS : ouverture plein écran depuis l'écran d'accueil (le manifeste ne
	// suffit pas sur les anciennes versions de Safari).
	appleWebApp: {
		capable: true,
		title: "Prettyfull",
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
