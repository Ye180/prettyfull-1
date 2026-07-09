import { Provider } from "@/shared/store/provider";
import { Toaster } from "@prettyfull/ui";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import "../styles/globals.css"; // Assurez-vous que vos styles sont bien importés

export const metadata: Metadata = {
	title: {
		default: "Prettyfull",
		template: "%s | Prettyfull",
	},
	description: "Prettyfull — boutique en ligne.",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Provider>
					<NextIntlClientProvider>{children}</NextIntlClientProvider>
					<Toaster position="top-right" />
				</Provider>
			</body>
		</html>
	);
}
