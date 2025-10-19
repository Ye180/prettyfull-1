"use client";

import { type FC } from "react";
import DescriptionFooter from "../molecules/footer/label";
import LinksFooter from "../molecules/footer/links";

const Footer: FC = () => {
	return (
		<footer className="px-4 py-16 text-white bg-black">
			<div className="w-full mx-auto lg:px-8">
				<div className="flex justify-between max-md:flex-col max-md:space-y-20">
					{/* LEFT SECTION */}
					<DescriptionFooter />

					{/* RIGHT SECTION */}
					<LinksFooter />
				</div>
			</div>
		</footer>
	);
};

export default Footer;
