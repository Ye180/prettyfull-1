"use client";

import HomeView from "@/features/homepage/views/home.view";

async function Page() {
	// { params }: { params: Promise<{ lang: string }> }
	// const { lang } = await params;
	return <HomeView />;
}

export default Page;
