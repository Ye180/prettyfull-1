import { FOOTER_DATA } from "@/lib/utils/constants/constants";
import Link from "next/link";

const LinksFooter = () => {
	return (
		<div className="grid grid-cols-2 col-span-1 gap-8 sm:grid-cols-4 lg:col-span-4">
			{FOOTER_DATA.map((item, index) => (
				<div key={index} className="text-left space-y-4">
					<h5 className="text-[1.5rem] font-semibold text-white tracking-wide">
						{item.title}
					</h5>
					<ul className="space-y-3 text-[1.4rem] text-white/60">
						{item.links.map((link) => (
							<li key={link.label}>
								<Link
									href={link.url}
									className="transition-colors hover:text-white"
								>
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
