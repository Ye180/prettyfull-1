"use client";

import Hero from "@/features/homepage/organims/hero";
import ModeCollection from "@/features/homepage/organims/mode-collection";
import NewsArrivals from "@/features/homepage/organims/news-arrivals";
import Recommendation from "@/features/homepage/organims/recommendation";
import TrendReport from "@/features/homepage/organims/trend-report";
import SearchBar from "@/shared/components/molecules/core/search";
import Space from "@/shared/components/molecules/core/space";
import Container from "../../../../../packages/ui/src/layouts/helpers/container";

const page = () => {
	return (
		<>
			<div className="  w-full [&>*]:w-full lg:[&>*]:px-40  space-y-4 lg:space-y-4 mb-20">
				<SearchBar />
				<Hero />
				<Space />
				<NewsArrivals />
				<Space />

				<Container maxWidth="100vw" className="h-[40vh] lg:h-[70vh] lg:px-40 ">
					<div className="h-full bg-black/60 overflow-hidden rounded-xl bg-[url(/home/promo-phone.jpg)] lg:bg-[url(/home/promo-desktop-1.jpg)] shadow-lg cursor-pointer   bg-cover  bg-center bg-no-repeat" />
				</Container>
				<Space />
				<ModeCollection />
				{/* <Space /> */}
				<Container maxWidth="100vw" className="w-full py-8 lg:px-40">
					<h2 className="text-center">
						Nous nous engageons à vous offrir une expérience d'achat fluide et
						agréable.
					</h2>
				</Container>
				{/* <Space /> */}
				<TrendReport />
				<Space />
				<Container maxWidth="100vw" className="h-[40vh] lg:h-[70vh] lg:px-40 ">
					<div className="h-full bg-black/60 overflow-hidden rounded-xl bg-[url(/home/promo-phone.jpg)] lg:bg-[url(/home/promo-desktop-1.jpg)] shadow-lg cursor-pointer   bg-cover  bg-center bg-no-repeat" />
				</Container>
				<Space />

				<Recommendation />
			</div>
		</>
	);
};

export default page;
