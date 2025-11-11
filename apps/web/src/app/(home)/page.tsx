"use client";

import HomeView from "@/features/homepage/views/home.view";

function Page() {
  // Client components cannot be async
  // If you need server-side data, remove "use client" or fetch data client-side
  return <HomeView />;
}

export default Page;
