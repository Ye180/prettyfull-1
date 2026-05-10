import HomeView from "@/features/homepage/views/home.view";

async function Page() {
	const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
	const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

	console.log(
		"l'environnement est",
		process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
	);
	return <HomeView />;
}

export default Page;
