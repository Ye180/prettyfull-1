import SmoothScroll from "@/shared/components/molecules/core/smooth-scroll";
import { Provider } from "@/shared/store/provider";
import { Toaster } from "@prettyfull/ui";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "../styles/globals.css"; // Assurez-vous que vos styles sont bien importés

export const metadata: Metadata = {
	title: {
		default: "Prettyfull",
		template: "%s | Prettyfull",
	},
	description: "Prettyfull — mode et accessoires en ligne.",
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
					</NextIntlClientProvider>
					<Toaster position="top-right" />
				</Provider>
			</body>
		</html>
	);
}
