"use client";

import { PlusIcon } from "lucide-react";

export default function FormProductAddImage({
	control,
	form,
	fields,
	append,
	remove,
}) {
	return (
		<div className="mb-8 space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-[1.5rem]! font-semibold pb-4">
					Variables (couleur / taille / stock / images)
				</h2>
				<button
					type="button"
					className="flex items-center h-12 gap-2 w-fit"
					onClick={() =>
						append({
							colorLabel: "",
							colorCode: "#FFFFFF",
							size: "",
							image: [],
							quantity: 0,
						})
					}
				>
					<PlusIcon className="inline-block p-1 mb-2 mr-2 text-white bg-black size-8 rounded-2xl" />
					{/* Ajouter une variante */}
				</button>
			</div>
			{/*  */}
		</div>
	);
}
