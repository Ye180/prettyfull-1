import { Provider } from "@/shared/store/provider";
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
				</Provider>
			</body>
		</html>
	);
}
