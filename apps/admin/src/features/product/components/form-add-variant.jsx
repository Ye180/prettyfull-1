"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
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
			{fields.map((field, index) => (
				<div
					key={field.id}
					className="relative p-4 space-y-3 border rounded-xl bg-muted/30"
				>
					<h3 className="text-lg font-medium">Variante #{index + 1}</h3>
					<button
						type="button"
						className="absolute text-red-500 top-4 right-4"
						onClick={() => remove(index)}
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
									<Input type="number" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					<InputDrag
						{...form.register(`step2.variants.${index}.image`)}
						form={form}
						label="Télécharger des images pour cette variante"
						valueName={`step2.variants.${index}.image`}
					/>
				</div>
			))}
		</div>
	);
}
