import { NavLink } from "@prettyfull/ui";

const BottomHeader = () => {
	return (
		<div className="flex items-center justify-start gap-6 mt-4  text-[1.5rem] max-md:hidden">
			{[
				{ href: "/collection", label: "Tailleur GT" },
				{ href: "/special-offer", label: "Jooging" },
				{ href: "/store", label: "Decembre" },
				{ href: "/store", label: "Zara Shoes" },
				{ href: "/store", label: "Herve Leger" },
				{ href: "/store", label: "Accessoires" },
				{ href: "/store", label: "Sexy-hot" },
			].map((link, index) => (
				<NavLink href={link.href} key={index} className="!text-[1.6rem]">
					{" "}
					{link.label}
				</NavLink>
			))}
		</div>
	);
};

export default BottomHeader;
