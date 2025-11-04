import { Provider } from "@/shared/store/provider";
import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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
					<NextIntlClientProvider>
						<NuqsAdapter>{children}</NuqsAdapter>
					</NextIntlClientProvider>
				</Provider>
			</body>
		</html>
	);
}
