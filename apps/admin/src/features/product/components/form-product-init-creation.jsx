"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetCategory } from "@/features/category/api/get-category";
import { SelectScrollable } from "@/shared/component/select-within-search";

export default function FormProductInitCreation({ control, form, ...props }) {
	const { data: category } = useGetCategory();

	return (
		<div className="mb-8 space-y-6">
			<h2 className="text-[1.5rem]! font-semibold pb-4">
				Informations générales
			</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					control={control}
					name="step1.nameFr"
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
					name="step1.nameEn"
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
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					control={control}
					name="step1.descriptionFr"
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
					name="step1.descriptionEn"
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
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					control={control}
					name="step1.smallDescriptionFr"
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
					name="step1.smallDescriptionEn"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Short description (EN)</FormLabel>
							<FormControl>
								<Input
									placeholder="Elegant and light summer dress..."
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<SelectScrollable
					control={control}
					nameId="step1.categoryId"
					label="Catégorie"
					placeholder="Sélectionner une catégorie"
					data={category}
				/>
				<FormField
					control={control}
					name="step1.link"
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
					name="step1.sku"
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
				name="step1.slug"
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
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<FormField
					control={control}
					name="step1.priceAmountFr"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Prix (FR:XOF)</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" step="0.01" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.currencyFr"
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
					name="step1.priceAmountEn"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Prix (EN:USD)</FormLabel>
							<FormControl>
								<Input type="number" placeholder="0" step="0.01" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.currencyEn"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Currency</FormLabel>
							<FormControl>
								<Input placeholder="USD" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 xm:grid-cols-2 md:grid-cols-4">
				<FormField
					control={control}
					name="step1.solde"
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
					name="step1.reducedPrice"
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
					name="step1.pourcentage"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Réduction (%)</FormLabel>
							<FormControl>
								<Input type="number" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.labelFr" // Renamed from 'label' to 'labelFr'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Étiquette (FR)</FormLabel>
							<FormControl>
								<Input placeholder="Nouveauté" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.labelEn" // Added 'labelEn'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Label (EN)</FormLabel>
							<FormControl>
								<Input placeholder="New Arrival" {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<h2 className="text-[1.5rem]! font-semibold pb-4">Méta-données SEO</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					control={control}
					name="step1.seoTitleFr"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Titre SEO (FR)</FormLabel>
							<FormControl>
								<Input
									placeholder="Robe d'été en lin - Votre Boutique"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.seoTitleEn"
					render={({ field }) => (
						<FormItem>
							<FormLabel>SEO Title (EN)</FormLabel>
							<FormControl>
								<Input
									placeholder="Summer Linen Dress - Your Shop"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					control={control}
					name="step1.seoDescFr"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description SEO (FR)</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									rows={3}
									placeholder="Achetez notre magnifique robe d'été en lin..."
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.seoDescEn"
					render={({ field }) => (
						<FormItem>
							<FormLabel>SEO Description (EN)</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									rows={3}
									placeholder="Shop our beautiful summer linen dress..."
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<FormField
				control={control}
				name="step1.seoKeywords"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Mots-clés SEO (séparés par virgules)</FormLabel>
						<FormControl>
							<Input {...field} placeholder="robe, été, lin, femme, mode,..." />
						</FormControl>
					</FormItem>
				)}
			/>
			<h2 className="text-[1.5rem]! font-semibold pb-4">Statut du produit</h2>
			<div className="grid gap-4 grid-col-2 md:grid-cols-4">
				<FormField
					control={control}
					name="step1.isActive"
					render={({ field }) => (
						<FormItem className="flex items-center gap-2">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className="whitespace-nowrap">
								Actif (Visible)
							</FormLabel>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.isFeatured"
					render={({ field }) => (
						<FormItem className="flex items-center gap-2">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel className="whitespace-nowrap">En vedette</FormLabel>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.stock"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="whitespace-nowrap">Stock global</FormLabel>
							<FormControl>
								<Input type="number" min={0} {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
