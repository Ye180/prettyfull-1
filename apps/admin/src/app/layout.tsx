import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
	title: "PrettyFull Admin",
	description: "Back-office PrettyFull",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
	return (
		<html lang="fr">
			<body>{children}</body>
		</html>
	);
};

export default RootLayout;
