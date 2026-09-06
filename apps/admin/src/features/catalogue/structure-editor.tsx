"use client";

import { UPLOAD_ENDPOINTS, type ProductKind } from "@prettyfull/contracts";
import { Button, Card, Checkbox, Field, Input } from "@/components/ui/primitives";
import { IconPlus, IconTrash } from "@/components/icons";
import { ImageUpload, ImageUploadList } from "@/components/ui/image-upload";

/**
 * Structure de déclinaison d'un produit, à la création (§2.2).
 *
 * Le régime est choisi une fois pour toutes : il n'apparaît plus à l'édition,
 * parce qu'en changer détruirait le stock et l'historique de mouvements du
 * produit. Passer de l'un à l'autre se fait en dupliquant.
 *
 * L'éditeur rend la règle de cohérence *visible* : choisir « à variantes »
 * masque les tailles de produit, et réciproquement. Le formulaire ne peut donc
 * pas construire un produit hybride, que l'API refuserait de toute façon.
 */

export interface SizeDraft {
	label: string;
	quantity: string;
}

export interface VariantDraft {
	name: string;
	colorHex: string;
	imageUrl: string;
	sizes: SizeDraft[];
	/** Utilisé uniquement quand la variante n'a aucune taille. */
	quantity: string;
}

export interface StructureState {
	kind: ProductKind;
	variants: VariantDraft[];
	sizes: SizeDraft[];
	/** Produit simple sans aucune taille : stock porté par le produit. */
	quantity: string;
	images: string[];
}

export const emptyStructure = (): StructureState => ({
	kind: "simple",
	variants: [],
	sizes: [],
	quantity: "0",
	images: [""],
});

const newSize = (): SizeDraft => ({ label: "", quantity: "0" });

const newVariant = (): VariantDraft => ({
	name: "",
	colorHex: "#111111",
	imageUrl: "",
	sizes: [],
	quantity: "0",
});

/** Traduit la structure en `variants` / `sizes` de `CreateProductInput`. */
export const toStructurePayload = (state: StructureState) => {
	const images = state.images
		.map((url) => url.trim())
		.filter(Boolean)
		.map((url, position) => ({ url, position }));

	if (state.kind === "variant") {
		return {
			kind: "variant" as const,
			images,
			sizes: [],
			variants: state.variants.map((variant, position) => ({
				name: variant.name.trim(),
				colorHex: variant.colorHex || null,
				position,
				images: variant.imageUrl.trim()
					? [{ url: variant.imageUrl.trim(), position: 0 }]
					: [],
				sizes: variant.sizes
					.filter((size) => size.label.trim())
					.map((size, sizePosition) => ({
						label: size.label.trim(),
						position: sizePosition,
						initialQuantity: Number(size.quantity) || 0,
					})),
				// Le stock de variante n'a de sens qu'en l'absence de tailles.
				...(variant.sizes.length === 0
					? { initialQuantity: Number(variant.quantity) || 0 }
					: {}),
			})),
		};
	}

	const sizes = state.sizes
		.filter((size) => size.label.trim())
		.map((size, position) => ({
			label: size.label.trim(),
			position,
			initialQuantity: Number(size.quantity) || 0,
		}));

	return {
		kind: "simple" as const,
		images,
		variants: [],
		sizes,
		...(sizes.length === 0 ? { initialQuantity: Number(state.quantity) || 0 } : {}),
	};
};

const SizeRows = ({
	sizes,
	onChange,
}: {
	sizes: SizeDraft[];
	onChange: (next: SizeDraft[]) => void;
}) => (
	<div className="flex flex-col gap-2">
		{sizes.map((size, index) => (
			<div key={index} className="flex items-end gap-2">
				<Field label={index === 0 ? "Taille" : ""} className="flex-1">
					<Input
						value={size.label}
						onChange={(event) =>
							onChange(
								sizes.map((item, i) =>
									i === index ? { ...item, label: event.target.value } : item,
								),
							)
						}
						placeholder="M"
					/>
				</Field>

				<Field label={index === 0 ? "Stock initial" : ""} className="w-32">
					<Input
						inputMode="numeric"
						value={size.quantity}
						onChange={(event) =>
							onChange(
								sizes.map((item, i) =>
									i === index ? { ...item, quantity: event.target.value } : item,
								),
							)
						}
					/>
				</Field>

				<Button
					variant="ghost"
					onClick={() => onChange(sizes.filter((_, i) => i !== index))}
					aria-label="Retirer la taille"
				>
					<IconTrash width={16} height={16} />
				</Button>
			</div>
		))}

		<Button size="sm" onClick={() => onChange([...sizes, newSize()])} className="self-start">
			<IconPlus width={14} height={14} />
			Ajouter une taille
		</Button>
	</div>
);

export const StructureEditor = ({
	value,
	onChange,
}: {
	value: StructureState;
	onChange: (next: StructureState) => void;
}) => {
	const set = <K extends keyof StructureState>(key: K, next: StructureState[K]) =>
		onChange({ ...value, [key]: next });

	return (
		<div className="flex flex-col gap-6">
			<Field
				label="Type de produit"
				hint="Ce choix est définitif : en changer plus tard demanderait de dupliquer le produit, car son stock et son historique y sont attachés."
			>
				<div className="grid gap-2 sm:grid-cols-2">
					{(
						[
							{
								kind: "simple" as const,
								title: "Produit simple",
								detail: "Tailles portées par le produit, ou aucune déclinaison.",
							},
							{
								kind: "variant" as const,
								title: "Produit à variantes",
								detail: "Un coloris par variante, avec ses photos et ses tailles.",
							},
						] satisfies { kind: ProductKind; title: string; detail: string }[]
					).map((option) => (
						<button
							key={option.kind}
							type="button"
							onClick={() =>
								onChange({
									...value,
									kind: option.kind,
									// Les deux modèles ne coexistent jamais : basculer vide
									// la structure de l'autre régime.
									variants: option.kind === "variant" ? [newVariant()] : [],
									sizes: [],
								})
							}
							className={`rounded-lg border p-3 text-left transition-colors ${
								value.kind === option.kind
									? "border-line-strong bg-accent-soft"
									: "border-line bg-raised hover:bg-accent-soft"
							}`}
						>
							<p className="text-[13px] font-medium text-ink">{option.title}</p>
							<p className="mt-0.5 text-[12px] text-muted">{option.detail}</p>
						</button>
					))}
				</div>
			</Field>

			<Field label="Images du produit" hint="La première sert de vignette dans les listes.">
				<ImageUploadList
					endpoint={UPLOAD_ENDPOINTS.catalog}
					values={value.images}
					onChange={(images) => set("images", images)}
				/>
			</Field>

			{value.kind === "simple" ? (
				<div className="flex flex-col gap-4">
					<Field
						label="Tailles"
						hint="Laissez vide si le produit n'a aucune déclinaison — le stock sera alors porté par le produit."
					>
						<SizeRows sizes={value.sizes} onChange={(next) => set("sizes", next)} />
					</Field>

					{value.sizes.length === 0 && (
						<Field label="Stock initial" className="w-40">
							<Input
								inputMode="numeric"
								value={value.quantity}
								onChange={(event) => set("quantity", event.target.value)}
							/>
						</Field>
					)}
				</div>
			) : (
				<Field label="Variantes de couleur">
					<div className="flex flex-col gap-3">
						{value.variants.map((variant, index) => (
							<Card key={index} className="p-4">
								<div className="mb-3 flex items-start justify-between gap-3">
									<p className="text-[13px] font-medium text-ink">
										Variante {index + 1}
										{variant.name && ` — ${variant.name}`}
									</p>
									{value.variants.length > 1 && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												set("variants", value.variants.filter((_, i) => i !== index))
											}
										>
											<IconTrash width={15} height={15} />
											Retirer
										</Button>
									)}
								</div>

								<div className="grid gap-3 sm:grid-cols-3">
									<Field label="Nom du coloris">
										<Input
											value={variant.name}
											onChange={(event) =>
												set(
													"variants",
													value.variants.map((item, i) =>
														i === index ? { ...item, name: event.target.value } : item,
													),
												)
											}
											placeholder="Noir"
										/>
									</Field>

									<Field label="Couleur">
										<div className="flex items-center gap-2">
											<input
												type="color"
												value={variant.colorHex}
												onChange={(event) =>
													set(
														"variants",
														value.variants.map((item, i) =>
															i === index ? { ...item, colorHex: event.target.value } : item,
														),
													)
												}
												className="h-9 w-12 shrink-0 cursor-pointer rounded border border-line bg-raised"
												aria-label="Couleur du coloris"
											/>
											<Input
												value={variant.colorHex}
												onChange={(event) =>
													set(
														"variants",
														value.variants.map((item, i) =>
															i === index ? { ...item, colorHex: event.target.value } : item,
														),
													)
												}
											/>
										</div>
									</Field>

									<Field label="Photo du coloris" className="sm:col-span-3">
										<ImageUpload
											endpoint={UPLOAD_ENDPOINTS.catalog}
											value={variant.imageUrl}
											onChange={(imageUrl) =>
												set(
													"variants",
													value.variants.map((item, i) =>
														i === index ? { ...item, imageUrl } : item,
													),
												)
											}
										/>
									</Field>
								</div>

								<div className="mt-3">
									<Checkbox
										label="Ce coloris est décliné en tailles"
										checked={variant.sizes.length > 0}
										onChange={(event) =>
											set(
												"variants",
												value.variants.map((item, i) =>
													i === index
														? { ...item, sizes: event.target.checked ? [newSize()] : [] }
														: item,
												),
											)
										}
									/>
								</div>

								<div className="mt-3">
									{variant.sizes.length > 0 ? (
										<SizeRows
											sizes={variant.sizes}
											onChange={(next) =>
												set(
													"variants",
													value.variants.map((item, i) =>
														i === index ? { ...item, sizes: next } : item,
													),
												)
											}
										/>
									) : (
										<Field label="Stock initial du coloris" className="w-40">
											<Input
												inputMode="numeric"
												value={variant.quantity}
												onChange={(event) =>
													set(
														"variants",
														value.variants.map((item, i) =>
															i === index ? { ...item, quantity: event.target.value } : item,
														),
													)
												}
											/>
										</Field>
									)}
								</div>
							</Card>
						))}

						<Button
							size="sm"
							onClick={() => set("variants", [...value.variants, newVariant()])}
							className="self-start"
						>
							<IconPlus width={14} height={14} />
							Ajouter une variante
						</Button>
					</div>
				</Field>
			)}
		</div>
	);
};
