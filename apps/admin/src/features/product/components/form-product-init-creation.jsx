"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetCategory } from "@/features/category/api/get-category";
import { SelectScrollable } from "@/shared/component/select-within-search";

export default function FormProductInitCreation({
	control,
	form,
	isDisabled = false,
	...props
}) {
	const { data: category } = useGetCategory();
	const solde = form.watch("step1.solde");

	return (
		<div className="mb-8 space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-[1.5rem]! font-semibold pb-4">
					Informations générales
				</h2>
				{isDisabled && (
					<span className="text-sm font-medium text-green-600">
						✓ Produit créé
					</span>
				)}
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					control={control}
					name="step1.nameFr"
					rules={{ required: "Le nom (FR) est requis" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nom (FR)</FormLabel>
							<FormControl>
								<Input
									placeholder="Robe d'été en lin"
									{...field}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.nameEn"
					rules={{ required: "Le nom (EN) est requis" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name (EN)</FormLabel>
							<FormControl>
								<Input
									placeholder="Summer linen dress"
									{...field}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					control={control}
					name="step1.descriptionFr"
					rules={{ required: "La description (FR) est requise" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description (FR)</FormLabel>
							<FormControl>
								<Textarea {...field} rows={3} disabled={isDisabled} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.descriptionEn"
					rules={{ required: "La description (EN) est requise" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description (EN)</FormLabel>
							<FormControl>
								<Textarea {...field} rows={3} disabled={isDisabled} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					control={control}
					name="step1.smallDescriptionFr"
					rules={{ required: "La courte description (FR) est requise" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Courte description (FR)</FormLabel>
							<FormControl>
								<Input
									placeholder="Robe d'été élégante et légère..."
									{...field}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.smallDescriptionEn"
					rules={{ required: "La courte description (EN) est requise" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Short description (EN)</FormLabel>
							<FormControl>
								<Input
									placeholder="Elegant and light summer dress..."
									{...field}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
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
					disabled={isDisabled}
					rules={{ required: "La catégorie est requise" }}
				/>
				<FormField
					control={control}
					name="step1.link"
					rules={{ required: "Le lien est requis" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Lien produit</FormLabel>
							<FormControl>
								<Input
									placeholder="/produits/robe-ete-lin"
									{...field}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.sku"
					rules={{ required: "Le SKU est requis" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>SKU</FormLabel>
							<FormControl>
								<Input
									placeholder="ROBE-LIN-2025"
									{...field}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<FormField
				control={control}
				name="step1.slug"
				rules={{
					required: "Le slug est requis",
					pattern: {
						value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
						message: "Slug invalide (caractères minuscules, chiffres, tirets)",
					},
				}}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Slug</FormLabel>
						<FormControl>
							<Input
								placeholder="robe-ete-lin"
								{...field}
								disabled={isDisabled}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<h2 className="text-[1.5rem]! font-semibold pb-4">Prix et promotion</h2>
			<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
				<FormField
					control={control}
					name="step1.priceAmountFr"
					rules={{
						required: "Le prix FR est requis",
						validate: (v) =>
							(v === "" || v === null ? "Le prix FR est requis" : v > 0) ||
							"Le prix FR doit être > 0",
					}}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Prix (FR:XOF)</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="0"
									step="0.01"
									value={field.value ?? ""}
									onChange={(e) => {
										const v =
											e.target.value === "" ? "" : e.target.valueAsNumber;
										field.onChange(Number.isNaN(v) ? "" : v);
									}}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.currencyFr"
					rules={{ required: "La monnaie FR est requise" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Monnaie</FormLabel>
							<FormControl>
								<Input placeholder="XOF" {...field} disabled={isDisabled} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.priceAmountEn"
					rules={{
						required: "Le prix EN est requis",
						validate: (v) =>
							(v === "" || v === null ? "Le prix EN est requis" : v > 0) ||
							"Le prix EN doit être > 0",
					}}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Prix (EN:USD)</FormLabel>
							<FormControl>
								<Input
									type="number"
									placeholder="0"
									step="0.01"
									value={field.value ?? ""}
									onChange={(e) => {
										const v =
											e.target.value === "" ? "" : e.target.valueAsNumber;
										field.onChange(Number.isNaN(v) ? "" : v);
									}}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.currencyEn"
					rules={{ required: "La monnaie EN est requise" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Currency</FormLabel>
							<FormControl>
								<Input placeholder="USD" {...field} disabled={isDisabled} />
							</FormControl>
							<FormMessage />
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
									onCheckedChange={(v) => {
										field.onChange(v);
										// Effacer erreurs promo si solde désactivé
										if (!v) {
											form.clearErrors("step1.reducedPrice");
											form.clearErrors("step1.pourcentage");
										}
									}}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormLabel>En solde</FormLabel>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.reducedPrice"
					rules={
						solde
							? {
									required: "Le prix réduit est requis",
									validate: (v) =>
										(v === "" || v === null
											? "Le prix réduit est requis"
											: v >= 0) || "Le prix réduit doit être ≥ 0",
								}
							: undefined
					}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Prix réduit (€)</FormLabel>
							<FormControl>
								<Input
									type="number"
									step="0.01"
									value={field.value ?? ""}
									onChange={(e) => {
										const v =
											e.target.value === "" ? "" : e.target.valueAsNumber;
										field.onChange(Number.isNaN(v) ? "" : v);
									}}
									disabled={isDisabled || !solde}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.pourcentage"
					rules={
						solde
							? {
									required: "Le pourcentage est requis",
									validate: (v) =>
										(v === "" || v === null
											? "Le pourcentage est requis"
											: v >= 0 && v <= 100) ||
										"Le pourcentage doit être entre 0 et 100",
								}
							: undefined
					}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Réduction (%)</FormLabel>
							<FormControl>
								<Input
									type="number"
									value={field.value ?? ""}
									onChange={(e) => {
										const v =
											e.target.value === "" ? "" : e.target.valueAsNumber;
										field.onChange(Number.isNaN(v) ? "" : v);
									}}
									disabled={isDisabled || !solde}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.labelFr"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Étiquette (FR)</FormLabel>
							<FormControl>
								<Input
									placeholder="Nouveauté"
									{...field}
									disabled={isDisabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.labelEn"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Label (EN)</FormLabel>
							<FormControl>
								<Input
									placeholder="New Arrival"
									{...field}
									disabled={isDisabled}
								/>
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
					rules={{ required: "Le titre SEO FR est requis" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Titre SEO (FR)</FormLabel>
							<FormControl>
								<Input
									placeholder="Robe d'été en lin - Votre Boutique"
									{...field}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.seoTitleEn"
					rules={{ required: "Le titre SEO EN est requis" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>SEO Title (EN)</FormLabel>
							<FormControl>
								<Input
									placeholder="Summer Linen Dress - Your Shop"
									{...field}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField
					control={control}
					name="step1.seoDescFr"
					rules={{ required: "La description SEO FR est requise" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description SEO (FR)</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									rows={3}
									placeholder="Achetez notre magnifique robe d'été en lin..."
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.seoDescEn"
					rules={{ required: "La description SEO EN est requise" }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>SEO Description (EN)</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									rows={3}
									placeholder="Shop our beautiful summer linen dress..."
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
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
							<Input
								{...field}
								placeholder="robe, été, lin, femme, mode,..."
								disabled={isDisabled}
							/>
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
									disabled={isDisabled}
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
									disabled={isDisabled}
								/>
							</FormControl>
							<FormLabel className="whitespace-nowrap">En vedette</FormLabel>
						</FormItem>
					)}
				/>
				<FormField
					control={control}
					name="step1.stock"
					rules={{
						required: "Le stock est requis",
						validate: (v) =>
							(v === "" || v === null ? "Le stock est requis" : v >= 0) ||
							"Le stock doit être ≥ 0",
					}}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="whitespace-nowrap">Stock global</FormLabel>
							<FormControl>
								<Input
									type="number"
									min={0}
									value={field.value ?? 0}
									onChange={(e) => {
										const v =
											e.target.value === "" ? "" : e.target.valueAsNumber;
										field.onChange(Number.isNaN(v) ? "" : v);
									}}
									disabled={isDisabled}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
