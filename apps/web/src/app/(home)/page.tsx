"use client";

import Hero from "@/features/homepage/organims/hero";
import ModeCollection from "@/features/homepage/organims/mode-collection";
import NewsArrivals from "@/features/homepage/organims/news-arrivals";
import Recommendation from "@/features/homepage/organims/recommendation";
import TrendReport from "@/features/homepage/organims/trend-report";
import Container from "../../../../../packages/ui/src/layouts/helpers/container";

const page = () => {
	return (
		<>
			<div className="  w-full [&>*]:w-full space-y-[8rem] lg:space-y-[13rem] ">
				<Hero />
				<NewsArrivals />
				<Container maxWidth="100vw" className="h-[40vh] lg:h-[70vh] lg:px-40 ">
					<div className="h-full bg-black/60 overflow-hidden rounded-xl bg-[url(/home/promo-phone.jpg)] lg:bg-[url(/home/promo-desktop-1.jpg)] shadow-lg cursor-pointer   bg-cover  bg-center bg-no-repeat" />
				</Container>
				<ModeCollection />
				<Container maxWidth="100vw" className="w-full lg:px-40">
					<h2 className="text-center">
						Nous nous engageons à vous offrir une expérience d'achat fluide et
						agréable.
					</h2>
				</Container>
				<TrendReport />
				<Container maxWidth="100vw" className="h-[40vh] lg:h-[70vh] lg:px-40 ">
					<div className="h-full bg-black/60 overflow-hidden rounded-xl bg-[url(/home/promo-phone.jpg)] lg:bg-[url(/home/promo-desktop-1.jpg)] shadow-lg cursor-pointer   bg-cover  bg-center bg-no-repeat" />
				</Container>

				<Recommendation />
			</div>
		</>
	);
};

export default page;
