import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/lib/providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "PrettyFull - Administration",
	description: "Back-office PrettyFull : catalogue, stocks, commandes.",
	// Un back-office n'a rien à faire dans un index de moteur de recherche.
	robots: { index: false, follow: false },
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	colorScheme: "light dark",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
	<html lang="fr">
		<body>
			<Providers>{children}</Providers>
		</body>
	</html>
);

export default RootLayout;
