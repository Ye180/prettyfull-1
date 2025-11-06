"use client";
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
import { useGetCategory } from "@/features/category/api/get-category";
import { SelectScrollable } from "@/shared/component/select-within-search";
import { PRODUCTS_QUERY_KEY } from "@/utils/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, PlusIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCreate } from "../api/create-products";

export default function ProductForm() {
	const { mutate: createProduct, isPending, isSuccess, isError } = useCreate();

	const form = useForm({
		defaultValues: {
			nameFr: "",
			nameEn: "",

			descriptionFr: "",
			descriptionEn: "",
			smallDescriptionFr: "",
			smallDescriptionEn: "",
			categoryId: "",
			link: "",
			sku: "",

			priceAmountFr: 0,
			priceAmountEn: 0,
			currencyFr: "XOF",
			currencyEn: "USD",

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
			slug: "",
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
				// Changer le type pour accepter une chaîne de caractères
				image: "", // Sera un string avec les URLs séparées par des virgules
			},
		},
	});

	const { control, handleSubmit } = form;
	const { fields, append, remove } = useFieldArray({
		control,
		name: "variable",
	});

	const queryClient = useQueryClient();

	// 🧠 Conversion JSON -> FormData
	const onSubmit = async (data) => {
		const jsonData = {
			name: { fr: data.nameFr, en: data.nameEn },
			description: { fr: data.descriptionFr, en: data.descriptionEn },
			categoryId: data.categoryId,
			link: data.link,
			smallDescription: {
				fr: data.smallDescriptionFr,
				en: data.smallDescriptionEn,
			},
			sku: data.sku,
			price: {
				amount: {
					fr: Number(data.priceAmountFr),
					en: Number(data.priceAmountEn),
				},
				currency: {
					fr: data.currencyFr,
					en: data.currencyEn,
				},
			},
			solde: data.solde,
			slug: data.slug,
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
			notVariable: data.notVariable.colorLabel
				? {
						color: {
							label: data.notVariable.colorLabel,
							code: data.notVariable.colorCode,
						},
						size: data.notVariable.size.split(",").map((s) => s.trim()),
						// Convertir la chaîne d'images en tableau
						image: data.notVariable.image.split(",").map((img) => img.trim()),
						quantity: Number(data.notVariable.quantity),
					}
				: null,
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

		// console.log("✅ FormData prêt :", formData.entries());
		// console.log("✅ FormData prêt :", jsonData);
		// console.log("✅ FormData prêt :", formData);

		createProduct(jsonData, {
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: [PRODUCTS_QUERY_KEY],
				});

				toast.success("Produit créé avec succès !");
			},
			onError: (error) => {
				console.error("Erreur lors de la création du produit :", error);
				toast.error("Erreur lors de la création du produit !");
			},
		});
	};

	const formatOptionLabel = (option) => {
		return `${option.account} - ${option.label}`;
	};

	const { data: category } = useGetCategory();

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
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={control}
						name="smallDescriptionFr"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Courte description (FR)</FormLabel>
								<FormControl>
									<Input
										placeholder="Robe d'été élégante et légère..."
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="smallDescriptionEn"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Short description (EN)</FormLabel>
								<FormControl>
									<Input
										placeholder="Robe d'été élégante et légère..."
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<div className="grid grid-cols-3 gap-4">
					<SelectScrollable
						control={control}
						nameId="categoryId"
						label="Catégorie"
						placeholder="Sélectionner une catégorie"
						data={category}
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
				<FormField
					control={control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Slug</FormLabel>
							<FormControl>
								<Input placeholder="robe-ete-lin" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<h2 className="text-[1.5rem]! font-semibold pb-4">Prix et promotion</h2>
				<div className="grid grid-cols-4 gap-4">
					<FormField
						control={control}
						name="priceAmountFr"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prix (FR:XOF)</FormLabel>
								<FormControl>
									<Input type="number" step="0.01" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="currencyFr"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Monnaie</FormLabel>
								<FormControl>
									<Input placeholder="XOF" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="priceAmountEn"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prix (EN:USD)</FormLabel>
								<FormControl>
									<Input placeholder="USD" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="currencyEn"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Currency</FormLabel>
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
				<div className="p-4 space-y-3 border rounded-xl bg-muted/30">
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
				<div className="flex items-center justify-between">
					<h2 className="text-[1.5rem]! font-semibold pb-4">
						Variables (couleur / taille / stock / images)
					</h2>
					<button
						type="button"
						className="h-12 w-fit"
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
					</button>
				</div>

				{fields.map((field, index) => (
					<div key={field.id} className="p-4 space-y-3 border rounded-xl">
						<div className="flex items-center justify-between">
							<h3 className="text-[1rem]! font-semibold pb-2">
								Variante {index + 1}
							</h3>
							<button
								type="button"
								className={"w-fit  rounded-lg!"}
								onClick={() => remove(index)}
							>
								<Minus className="inline-block p-1 mb-1 mr-1 text-white bg-red-600 size-6 rounded-2xl" />
							</button>
						</div>

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
					</div>
				))}

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
							<FormItem className="">
								<FormLabel>SEO Mots-clés (séparés par virgules)</FormLabel>
								<FormControl>
									<Input {...field} placeholder="robe, femme, été, lin..." />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				{/* <SelectWithSearch
					options={[
						{
							id: "subclass1",
							label: "Sous-classe A",
							account: "Compte 123",
						},
						{
							id: "subclass2",
							label: "Sous-classe B",
							account: "Compte 456",
						},
					]}
					value={form.watch("seoKeywords")}
					onChange={(value) => {
						form.setValue("subClassId", value);
					}}
					placeholder="Sélectionner une sous classe"
					searchPlaceholder="Rechercher le numero de sous classe..."
					emptyMessage="Aucune sous classe trouvée."
					loading={false}
					formatOptionLabel={formatOptionLabel}
					className="h-20 rounded-3xl border-2 border-[#dadddc] text-[1.5rem]"
					// error={"Erreur de chargement des sous classes"}
				/> */}

				<div className="flex justify-start gap-4 pt-6">
					<Button type="submit" className="h-12 w-fit">
						Enregistrer le produit
					</Button>
					<Button type="submit" className="h-12 bg-red-500 w-fit">
						Annuler
					</Button>
				</div>
			</form>
		</Form>
	);
}
