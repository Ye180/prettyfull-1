import { NavLink } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";

const BottomHeader = ({
	className,
	className_2,
}: {
	className?: string;
	className_2?: string;
}) => {
	return (
		<div
			className={cn(
				"max-sm:hidden sm:flex items-center justify-start gap-6 mt-4  text-[1.5rem] ",
				className
			)}
		>
			<div
				className={cn(
					"flex items-center justify-start gap-6 mt-4  text-[1.5rem]",
					className_2
				)}
			>
				{[
					{ href: "/collection", label: "Tailleur GT" },
					{ href: "/special-offer", label: "Jooging" },
					{ href: "/store", label: "Decembre" },
					{ href: "/store", label: "Zara Shoes" },
					{ href: "/store", label: "Herve Leger" },
					{ href: "/store", label: "Accessoires" },
					{ href: "/store", label: "Sexy-hot" },
				].map((link, index) => (
					<NavLink href={link.href} key={index} className="!text-[1.6rem] ">
						{" "}
						{link.label}
					</NavLink>
				))}
			</div>
		</div>
	);
};

export default BottomHeader;
