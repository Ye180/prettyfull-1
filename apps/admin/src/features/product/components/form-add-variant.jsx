"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputDrag from "@/components/ui/input-drag-files";
import { PlusIcon, X } from "lucide-react";

export default function FormProductAddVariant({
	control,
	form,
	fields,
	append,
	remove,
}) {
	// Vérifier les doublons de couleur (avec garde)
	const checkDuplicateColor = (currentIndex, colorCode) => {
		const variants = form.watch("step2.variants") || [];
		const normalize = (v) =>
			typeof v === "string" ? v.toLowerCase().trim() : "";
		const current = normalize(colorCode);
		if (!current) return false;

		const duplicates = variants.filter((v, idx) => {
			if (idx === currentIndex) return false;
			return normalize(v?.colorCode) === current;
		});
		return duplicates.length > 0;
	};

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
			{fields.length === 0 && (
				<div className="p-4 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-lg">
					Aucune variante créée. Cliquez sur le bouton ci-dessus pour en ajouter
					une.
				</div>
			)}
			{fields.map((field, index) => {
				const currentColorCode = form.watch(
					`step2.variants.${index}.colorCode`
				);
				const isDuplicate = checkDuplicateColor(index, currentColorCode);

				return (
					<div
						key={field.id}
						className={`relative p-4 space-y-3 border rounded-xl ${
							isDuplicate ? "border-red-500 bg-red-50" : "bg-muted/30"
						}`}
					>
						<div className="flex items-center justify-between">
							<h3 className="font-medium text-[0.8rem]">
								Variante #{index + 1}
							</h3>
							{isDuplicate && (
								<span className="mr-8 text-sm font-medium text-red-600">
									⚠️ Couleur en double
								</span>
							)}
						</div>
						<button
							type="button"
							className="absolute text-red-500 top-4 right-4 hover:text-red-700"
							onClick={() => remove(index)}
							title="Supprimer cette variante"
						>
							<X className="size-5" />
						</button>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<FormField
								control={control}
								name={`step2.variants.${index}.colorLabel`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nom de couleur</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Vert olive" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name={`step2.variants.${index}.colorCode`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Code couleur</FormLabel>
										<FormControl className="">
											<Input
												className="w-24 rounded-lg!"
												type="color"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={control}
							name={`step2.variants.${index}.size`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tailles (séparées par virgules)</FormLabel>
									<FormControl>
										<Input {...field} placeholder="S, M, L, XL" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name={`step2.variants.${index}.quantity`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Quantité</FormLabel>
									<FormControl>
										{/* Coerce number for validation/API */}
										<Input
											type="number"
											value={field.value ?? 0}
											onChange={(e) => {
												const v =
													e.target.value === "" ? "" : e.target.valueAsNumber;
												field.onChange(Number.isNaN(v) ? "" : v);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* IMPORTANT: ne pas utiliser form.register ici.
						    On laisse InputDrag gérer la valeur via FormField (Controller)
						    pour isoler chaque variante par index */}
						<InputDrag
							form={form}
							label="Télécharger des images pour cette variante"
							valueName={`step2.variants.${index}.image`}
						/>
					</div>
				);
			})}
		</div>
	);
}
