"use client";

import { getItem } from "@/lib/utils/local-storage";
import { useEffect, useState } from "react";

const Banner = () => {
	const [title, setTitle] = useState<string | null>(null);

	useEffect(() => {
		const storedTitle = getItem("links");
		setTitle(storedTitle);
	}, []);

	return (
		<div className="w-full h-full bg-dark rounded-xl flex items-center justify-center bg-[url(/collections/banner-mode.jpg)] bg-cover bg-start bg-no-repeat relative overflow-hidden">
			<div className="absolute inset-0 w-full h-full bg-black/35 " />
			<h4 className="border md:min-w-[25rem] md:min-h-[10rem] max-md:!text-[4rem] md:!text-[7rem] font-bold static z-50 px-10 py-4 text-white rounded-lg bg-black/30 backdrop-blur-sm uppercase tracking-wider text-center">
				{title}
			</h4>
		</div>
	);
};

export default Banner;
