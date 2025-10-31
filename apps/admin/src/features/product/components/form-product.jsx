import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray, useForm } from "react-hook-form";

export default function ProductForm() {
	const form = useForm({
		defaultValues: {
			nameFr: "",
			nameEn: "",
			descriptionFr: "",
			descriptionEn: "",
			smallDescription: "",
			categoryId: "",
			link: "",
			sku: "",
			priceAmount: 0,
			priceCurrency: "EUR",
			solde: false,
			reducedPrice: 0,
			pourcentage: 0,
			label: "",
			isActive: true,
			isFeatured: false,
			stock: 0,
			seoTitleFr: "",
			seoTitleEn: "",
			seoDescFr: "",
			seoDescEn: "",
			seoKeywords: "",
			variable: [
				{
					colorLabel: "",
					colorCode: "#FFFFFF",
					size: "",
					quantity: 0,
					image: [],
				},
			],
			notVariable: {
				colorLabel: "",
				colorCode: "#FFFFFF",
				size: "",
				quantity: 0,
				image: [],
			},
		},
	});

	const { control, handleSubmit } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "variable",
	});

	// 🧠 Conversion JSON -> FormData
	const onSubmit = async (data) => {
		const jsonData = {
			name: { fr: data.nameFr, en: data.nameEn },
			description: { fr: data.descriptionFr, en: data.descriptionEn },
			categoryId: data.categoryId,
			link: data.link,
			smallDescription: data.smallDescription,
			sku: data.sku,
			price: { amount: Number(data.priceAmount), currency: data.priceCurrency },
			solde: data.solde,
			promotion: {
				reduced_price: Number(data.reducedPrice),
				pourcentage: Number(data.pourcentage),
			},
			isActive: data.isActive,
			isFeatured: data.isFeatured,
			stock: Number(data.stock),
			label: data.label,
			seoMeta: {
				title: { fr: data.seoTitleFr, en: data.seoTitleEn },
				description: { fr: data.seoDescFr, en: data.seoDescEn },
				keywords: data.seoKeywords.split(",").map((k) => k.trim()),
			},
			variable: data.variable.map((v) => ({
				color: { label: v.colorLabel, code: v.colorCode },
				size: v.size.split(",").map((s) => s.trim()),
				quantity: Number(v.quantity),
				image: v.image,
			})),
			notVariable: {
				color: {
					label: data.notVariable.colorLabel,
					code: data.notVariable.colorCode,
				},
				size: data.notVariable.size.split(",").map((s) => s.trim()),
				quantity: Number(data.notVariable.quantity),
				image: data.notVariable.image,
			},
		};

		// Conversion en FormData
		const formData = new FormData();
		const appendFormData = (obj, parentKey = "") => {
			Object.entries(obj).forEach(([key, value]) => {
				const formKey = parentKey ? `${parentKey}[${key}]` : key;
				if (value instanceof File) {
					formData.append(formKey, value);
				} else if (Array.isArray(value)) {
					value.forEach((v, i) => appendFormData(v, `${formKey}[${i}]`));
				} else if (typeof value === "object" && value !== null) {
					appendFormData(value, formKey);
				} else {
					formData.append(formKey, value);
				}
			});
		};
		appendFormData(jsonData);

		console.log("✅ FormData prêt :", formData.entries());
		console.log("✅ FormData prêt :", jsonData);
		console.log("✅ FormData prêt :", formData);
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<h2 className="text-[1.5rem]! font-semibold pb-4">
					Informations générales
				</h2>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={control}
						name="nameFr"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nom (FR)</FormLabel>
								<FormControl>
									<Input placeholder="Robe d'été en lin" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="nameEn"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name (EN)</FormLabel>
								<FormControl>
									<Input placeholder="Summer linen dress" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={control}
						name="descriptionFr"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description (FR)</FormLabel>
								<FormControl>
									<Textarea {...field} rows={3} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="descriptionEn"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description (EN)</FormLabel>
								<FormControl>
									<Textarea {...field} rows={3} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={control}
					name="smallDescription"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Courte description</FormLabel>
							<FormControl>
								<Input
									placeholder="Robe d'été élégante et légère..."
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-3 gap-4">
					<FormField
						control={control}
						name="categoryId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Catégorie ID</FormLabel>
								<FormControl>
									<Input placeholder="68fe98d69e21f9f242e9d61c" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="link"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Lien produit</FormLabel>
								<FormControl>
									<Input placeholder="/produits/robe-ete-lin" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="sku"
						render={({ field }) => (
							<FormItem>
								<FormLabel>SKU</FormLabel>
								<FormControl>
									<Input placeholder="ROBE-LIN-2025" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<h2 className="text-[1.5rem]! font-semibold pb-4">Prix et promotion</h2>
				<div className="grid grid-cols-4 gap-4">
					<FormField
						control={control}
						name="priceAmount"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prix (€)</FormLabel>
								<FormControl>
									<Input type="number" step="0.01" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="solde"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<FormLabel>En solde</FormLabel>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="reducedPrice"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prix réduit (€)</FormLabel>
								<FormControl>
									<Input type="number" step="0.01" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="pourcentage"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Réduction (%)</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<h2 className="text-[1.5rem]! font-semibold pb-4">
					Option unique (notVariable)
				</h2>
				<div className="border p-4 rounded-xl space-y-3 bg-muted/30">
					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={control}
							name="notVariable.colorLabel"
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
							name="notVariable.colorCode"
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
						name="notVariable.size"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Tailles disponibles (séparées par virgules)
								</FormLabel>
								<FormControl>
									<Input {...field} placeholder="S, M, L" />
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="notVariable.quantity"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Quantité</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="notVariable.image"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Images (URLs séparées par virgules)</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder="https://cdn.example.com/image1.jpg, ..."
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<h2 className="text-[1.5rem]! font-semibold pb-4">
					Variables (couleur / taille / stock / images)
				</h2>
				{fields.map((field, index) => (
					<div key={field.id} className="border p-4 rounded-xl space-y-3">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={control}
								name={`variable.${index}.colorLabel`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nom de couleur</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Beige naturel" />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name={`variable.${index}.colorCode`}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Code couleur</FormLabel>
										<FormControl>
											<Input
												type="color"
												className="w-24 rounded-lg!"
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={control}
							name={`variable.${index}.size`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tailles (séparées par virgule)</FormLabel>
									<FormControl>
										<Input {...field} placeholder="XS, S, M, L" />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name={`variable.${index}.quantity`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Quantité</FormLabel>
									<FormControl>
										<Input type="number" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name={`variable.${index}.image`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Images (URLs séparées par virgule)</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="https://cdn.example.com/image1.jpg, ..."
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<Button
							variant="destructive"
							type="button"
							className={"w-fit h-10 rounded-lg!"}
							onClick={() => remove(index)}
						>
							Supprimer cette variante
						</Button>
					</div>
				))}
				<Button
					type="button"
					className="w-fit h-12"
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
					Ajouter une variante
				</Button>
				<h2 className="text-[1.5rem]! font-semibold py-4">
					Autres informations
				</h2>
				<div className="grid grid-cols-3 gap-4">
					<FormField
						control={control}
						name="label"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Label produit</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Collection Été 2025" />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="stock"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Stock total</FormLabel>
								<FormControl>
									<Input type="number" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="isFeatured"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<FormLabel>Mise en avant</FormLabel>
							</FormItem>
						)}
					/>
				</div>
				<h2 className="text-[1.5rem]! font-semibold pb-4">SEO</h2>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={control}
						name="seoTitleFr"
						render={({ field }) => (
							<FormItem>
								<FormLabel>SEO Titre (FR)</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="seoTitleEn"
						render={({ field }) => (
							<FormItem>
								<FormLabel>SEO Title (EN)</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="seoDescFr"
						render={({ field }) => (
							<FormItem>
								<FormLabel>SEO Description (FR)</FormLabel>
								<FormControl>
									<Textarea {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="seoDescEn"
						render={({ field }) => (
							<FormItem>
								<FormLabel>SEO Description (EN)</FormLabel>
								<FormControl>
									<Textarea {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="seoKeywords"
						render={({ field }) => (
							<FormItem className="col-span-2">
								<FormLabel>SEO Mots-clés (séparés par virgules)</FormLabel>
								<FormControl>
									<Input {...field} placeholder="robe, femme, été, lin..." />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-start gap-4 pt-6">
					<Button type="submit" className="w-fit h-12">
						Enregistrer le produit
					</Button>
					<Button type="submit" className="w-fit h-12 bg-red-500">
						Annuler
					</Button>
				</div>
			</form>
		</Form>
	);
}
