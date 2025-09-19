import { FOOTER_DATA } from "@/lib/utils/constants";
import Link from "next/link";

const LinksFooter = () => {
	return (
		<div className="flex max-lg:justify-between lg:justify-start lg:w-3/6 max-lg:w-full">
			{/* SHOP */}

			{FOOTER_DATA.map((items, index) => (
				<div key={index} className="text-left lg:w-auto lg:flex-1">
					<h5 className="mb-3 !text-[2.5rem] font-semibold tracking-wider">
						{items.title}
					</h5>
					<ul className="space-y-3 text-gray-400 text-md">
						{items.links.map((link) => (
							<li key={link.label}>
								<Link href="/" className="transition-colors hover:text-white">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default LinksFooter;
