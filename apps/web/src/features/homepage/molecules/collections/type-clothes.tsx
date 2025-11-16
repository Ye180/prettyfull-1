import { Checkbox } from "@prettyfull/ui";

const items = [
	{
		id: "robes",
		label: "Robes",
	},
	{
		id: "ensembles-coordonnés",
		label: "Ensembles coordonnés",
	},
	{
		id: "hauts",
		label: "Hauts",
	},
	{
		id: "jupes",
		label: "Jupes",
	},
	{
		id: "jeans",
		label: "Jeans",
	},
];

const TypeClothes = () => {
	return (
		<>
			{items.map((item, i) => (
				<div key={i}>
					<div className="flex items-start gap-4 text-balance max-md:w-fit ">
						{" "}
						<Checkbox className="" />
						<span className="text-[1.5rem]">{item.label}</span>
					</div>
				</div>
			))}
		</>
	);
};

export default TypeClothes;
