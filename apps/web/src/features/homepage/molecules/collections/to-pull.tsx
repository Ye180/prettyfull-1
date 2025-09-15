import { Checkbox } from "@prettyfull/ui";

const constantByFilter = {
	mise_en_avant: "Tous les produits",
	meilleures_ventes: "Meilleures ventes",
	prix_croissant: "Prix croissant",
	prix_décroissant: "Prix décroissant",
	nouveautés: "Nouveautés",
};
const ToPull = () => {
	return (
		<div className="flex flex-wrap gap-x-4 gap-y-8">
			{Object.entries(constantByFilter).map(([key, value]) => (
				<div key={key}>
					<div className="flex flex-wrap items-start  ">
						{" "}
						<Checkbox className="flex items-center justify-center gap-4 border rounded-lg border-black/10 w-64 h-18 p-4">
							{value}
						</Checkbox>
					</div>
				</div>
			))}
		</div>
	);
};

export default ToPull;
