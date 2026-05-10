import { Provider } from "@/shared/store/provider";
import { Toaster } from "@prettyfull/ui";
import { NextIntlClientProvider } from "next-intl";
import "../styles/globals.css"; // Assurez-vous que vos styles sont bien importés

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
