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
import { useGetPrimaryCategory } from "@/features/shared/api/get-primary-category";
import { SelectScrollable } from "@/shared/component/select-within-search";
import { CATEGORIES_QUERY_KEY } from "@/utils/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCreateCategory } from "../api/create-category";
import { useGetCategory } from "../api/get-category";

function FormCategory() {
	const form = useForm({
		defaultValues: {
			nameFr: "",
			nameEn: "",
			slug: "",
			descriptionFr: "",
			descriptionEn: "",
			parent: "",
			countries: "",
			isActive: false,
			isVisible: false,
			first: false,
			second: false,
			displayOrder: 0,
			icon: "",
			image: "",
			seoTitleFr: "",
			seoTitleEn: "",
			seoDescFr: "",
			seoDescEn: "",
			seoKeywords: "",
		},
	});

	const { data: category } = useGetCategory();

	const [imageFile, setImageFile] = useState(null);

	const {
		mutate: createCategory,
		isPending,
		isSuccess,
		isError,
	} = useCreateCategory();

	const queryClient = useQueryClient();

	const onSubmit = (data) => {
		const formData = new FormData();

		// Structure name object according to DTO (required)
		formData.append("name[fr]", data.nameFr || "");
		formData.append("name[en]", data.nameEn || "");

		// Slug (required)
		const normalizedSlug = data.slug
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
		formData.append("slug", normalizedSlug);

		// Structure description object according to DTO (required)
		formData.append("description[fr]", data.descriptionFr || "");
		formData.append("description[en]", data.descriptionEn || "");

		// Optional fields - only append if they have values
		if (data.parent) {
			formData.append("parent", data.parent);
		}

		// Countries array (optional)
		if (data.countries && data.countries.trim()) {
			const countriesArray = data.countries
				.split(",")
				.map((c) => c.trim().toUpperCase())
				.filter((c) => c.length === 2);

			if (countriesArray.length > 0) {
				countriesArray.forEach((country, index) => {
					formData.append(`countries[${index}]`, country);
				});
			}
		}

		// Boolean fields (optional)
		if (data.isActive !== undefined) {
			formData.append("isActive", data.isActive.toString());
		}
		if (data.isVisible !== undefined) {
			formData.append("isVisible", data.isVisible.toString());
		}
		if (data.first !== undefined) {
			formData.append("first", data.first.toString());
		}
		if (data.second !== undefined) {
			formData.append("second", data.second.toString());
		}

		// Display order (optional)
		if (data.displayOrder !== undefined && data.displayOrder !== null) {
			formData.append("displayOrder", data.displayOrder.toString());
		}

		// Icon (optional)
		if (data.icon && data.icon.trim()) {
			formData.append("icon", data.icon);
		}

		// File upload (optional)

		for (const file of data.image) {
			console.log("file", file);
			formData.append("image", file);
		}

		// SEO Meta structure (optional)
		const hasSeoTitle = data.seoTitleFr || data.seoTitleEn;
		const hasSeoDesc = data.seoDescFr || data.seoDescEn;
		const hasSeoKeywords = data.seoKeywords && data.seoKeywords.trim();

		if (hasSeoTitle || hasSeoDesc || hasSeoKeywords) {
			if (hasSeoTitle) {
				formData.append("seoMeta[title][fr]", data.seoTitleFr || "");
				formData.append("seoMeta[title][en]", data.seoTitleEn || "");
			}

			if (hasSeoDesc) {
				formData.append("seoMeta[description][fr]", data.seoDescFr || "");
				formData.append("seoMeta[description][en]", data.seoDescEn || "");
			}

			if (hasSeoKeywords) {
				const keywordsArray = data.seoKeywords
					.split(",")
					.map((k) => k.trim())
					.filter((k) => k.length > 0);

				if (keywordsArray.length > 0) {
					keywordsArray.forEach((keyword, index) => {
						formData.append(`seoMeta[keywords][${index}]`, keyword);
					});
				}
			}
		}

		// Log FormData for debugging
		console.log("FormData content:", formData);
		console.log("FormData content:", data);
		console.log("FormData content:", imageFile);
		for (let [key, value] of formData.entries()) {
			console.log(key, value);
		}

		createCategory(formData, {
			onSuccess: async () => {
				console.log("Catégorie créée avec succès !");
				toast.success("Catégorie créée avec succès !");
				form.reset();
				await queryClient.invalidateQueries({
					queryKey: [CATEGORIES_QUERY_KEY],
				});
			},
			onError: (error) => {
				console.error("Erreur lors de la création:", error);
				toast.error(
					`Erreur lors de la création de la catégorie : ${error.message}`
				);
			},
		});
	};

	useEffect(() => {
		// Handle image file changes

		setImageFile(imageFile);
		if (imageFile) {
			const formData = new FormData();
			formData.append("image", imageFile);
			// Call API to upload image
		}
	}, [imageFile]);

	const { data: primaryCategories } = useGetPrimaryCategory();

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
				<div className="w-full space-y-6">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="nameFr"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom (FR)</FormLabel>
									<FormControl>
										<Input placeholder="Chaussures de sport" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="nameEn"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name (EN)</FormLabel>
									<FormControl>
										<Input placeholder="Sports Shoes" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					{/* Slug */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Slug</FormLabel>
									<FormControl>
										<Input placeholder="sports-shoes" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<SelectScrollable
							control={form.control}
							nameId="parent"
							label="Catégorie parente"
							placeholder="Sélectionner une catégorie"
							data={primaryCategories || []}
							className="w-full"
						/>
					</div>

					{/* Description */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="descriptionFr"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description (FR)</FormLabel>
									<FormControl>
										<Input
											placeholder="Des baskets et chaussures..."
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="descriptionEn"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description (EN)</FormLabel>
									<FormControl>
										<Input
											placeholder="Sneakers and sports shoes..."
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					{/* Pays */}
					<FormField
						control={form.control}
						name="countries"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									Pays (codes ISO alpha-2, séparés par des virgules)
								</FormLabel>
								<FormControl>
									<Input placeholder="CI, SN, FR" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>

					{/* Booleans */}
					<div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>Actif</FormLabel>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isVisible"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>Visible</FormLabel>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="first"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>Première catégorie</FormLabel>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="second"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>Seconde catégorie</FormLabel>
								</FormItem>
							)}
						/>
					</div>

					{/* Autres champs */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="displayOrder"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ordre d’affichage</FormLabel>
									<FormControl>
										<Input type="number" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Icône (FontAwesome)</FormLabel>
									<FormControl>
										<Input
											placeholder="fa-solid fa-person-running"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="image"
						render={({ field: { onChange, value, ...field } }) => (
							<FormItem>
								<FormLabel>Image</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="file"
										accept="image/*"
										onChange={(e) => {
											const files = e.target.files;
											onChange(files);
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{/* SEO */}
						<FormField
							control={form.control}
							name="seoTitleFr"
							render={({ field }) => (
								<FormItem>
									<FormLabel>SEO Titre (FR)</FormLabel>
									<FormControl>
										<Input
											placeholder="Chaussures de sport - Performance et confort"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="seoTitleEn"
							render={({ field }) => (
								<FormItem>
									<FormLabel>SEO Title (EN)</FormLabel>
									<FormControl>
										<Input
											placeholder="Sports Shoes - Performance and Comfort"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="seoDescFr"
							render={({ field }) => (
								<FormItem>
									<FormLabel>SEO Description (FR)</FormLabel>
									<FormControl>
										<Input placeholder="Découvrez nos baskets..." {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="seoDescEn"
							render={({ field }) => (
								<FormItem>
									<FormLabel>SEO Description (EN)</FormLabel>
									<FormControl>
										<Input placeholder="Explore our sneakers..." {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="seoKeywords"
						render={({ field }) => (
							<FormItem className="">
								<FormLabel>SEO Mots-clés (séparés par des virgules)</FormLabel>
								<FormControl>
									<Input
										placeholder="chaussure sport, basket, running..."
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					{/* <button type="submit">Submit</button> */}
					<div className="flex items-center justify-center col-span-2 gap-4 mt-4 w-fit">
						<Button
							type="submit"
							disabled={isPending}
							className="flex items-center justify-center py-6 mx-auto rounded-lg w-fit"
						>
							{isPending ? "Enregistrement..." : "Enregistrer"}
						</Button>
						<Button
							type="button"
							onClick={() => form.reset()}
							className="flex items-center justify-center py-6 mx-auto bg-red-600 rounded-lg w-fit"
						>
							Annuler
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}

export default FormCategory;
