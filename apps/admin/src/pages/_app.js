import { HostnameProvider } from "@/Components/Provider/HostnameProvider";
import Providers from "@/Components/Provider/ProviderQuery";
import "@/styles/font.css";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }) {
	return (
		<Providers>
			<HostnameProvider>
				<Component {...pageProps} />
			</HostnameProvider>
		</Providers>
	);
}
