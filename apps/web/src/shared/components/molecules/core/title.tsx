import ViewAll from "./view-all";

const Title = ({
	title,
	href,
	buttonLabel,
}: {
	title: string;
	href?: string;
	buttonLabel: string;
}) => {
	return (
		<div className="flex justify-between space-y-8">
			<h4 className="w-fit max-md:text-[2.5rem]!"> {title}</h4>

			<ViewAll href={href}>{buttonLabel}</ViewAll>
		</div>
	);
};

export default Title;
