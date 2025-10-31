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
import { useForm } from "react-hook-form";

function FormCategory() {
	const form = useForm({
		defaultValues: {
			nameFr: "",
			nameEn: "",
			slug: "",
			descriptionFr: "",
			descriptionEn: "",
			countries: "",
			isActive: false,
			isVisible: false,
			displayOrder: 0,
			icon: "",
			image: "",
			primary: false,
			second: false,
			seoTitleFr: "",
			seoTitleEn: "",
			seoDescFr: "",
			seoDescEn: "",
			seoKeywords: "",
		},
	});

	const onSubmit = (data) => {
		const jsonData = {
			name: {
				fr: data.nameFr,
				en: data.nameEn,
			},
			slug: data.slug,
			description: {
				fr: data.descriptionFr,
				en: data.descriptionEn,
			},
			countries: data.countries.split(",").map((c) => c.trim()),
			isActive: data.isActive,
			isVisible: data.isVisible,
			displayOrder: Number(data.displayOrder),
			icon: data.icon,
			image: data.image,
			second: data.second,
			primaire: data.primaire,
			seoMeta: {
				title: {
					fr: data.seoTitleFr,
					en: data.seoTitleEn,
				},
				description: {
					fr: data.seoDescFr,
					en: data.seoDescEn,
				},
				keywords: data.seoKeywords.split(",").map((k) => k.trim()),
			},
		};

		console.log(jsonData);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid gap-4 grid-cols-1 md:grid-cols-2 pb-8"
			>
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

				{/* Slug */}
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

				{/* Description */}
				<FormField
					control={form.control}
					name="descriptionFr"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description (FR)</FormLabel>
							<FormControl>
								<Input placeholder="Des baskets et chaussures..." {...field} />
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
								<Input placeholder="Sneakers and sports shoes..." {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Pays */}
				<FormField
					control={form.control}
					name="countries"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Pays (séparés par des virgules)</FormLabel>
							<FormControl>
								<Input placeholder="CI, SN, FR" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				{/* Booleans */}
				<div className="flex gap-4">
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
						name="primary"
						render={({ field }) => (
							<FormItem className="flex items-center gap-2">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<FormLabel>Primaire</FormLabel>
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
								<FormLabel>Secondaire</FormLabel>
							</FormItem>
						)}
					/>
				</div>

				{/* Autres champs */}
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
								<Input placeholder="fa-solid fa-person-running" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Image URL</FormLabel>
							<FormControl>
								<Input
									placeholder="https://cdn.example.com/images/categories/..."
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

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
				<FormField
					control={form.control}
					name="seoKeywords"
					render={({ field }) => (
						<FormItem className="col-span-2">
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
				<div className="col-span-2 w-fit flex justify-center gap-4 mt-4 items-center">
					<Button
						type="submit"
						className="  rounded-lg!  py-6  mx-auto flex justify-center items-center w-fit"
					>
						Enregistrer
					</Button>
					<Button
						type="button"
						className="  rounded-lg! bg-red-600 py-6  mx-auto flex justify-center items-center w-fit"
					>
						Annuler
					</Button>
				</div>
			</form>
		</Form>
	);
}

export default FormCategory;
