"use client";

import type { Category, Paginated, Product } from "@prettyfull/contracts";
import { PERMISSIONS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiRequestError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { CONTENT_STATUS_LABELS, STOCK_STATUS_LABELS, formatMoney } from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Thumb } from "@/components/ui/table";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	ErrorState,
	Spinner,
	contentStatusTone,
	stockStatusTone,
} from "@/components/ui/primitives";
import { IconCopy, IconTrash } from "@/components/icons";
import {
	ProductFields,
	productToFields,
	toProductPayload,
	type ProductFieldsState,
} from "@/features/catalogue/product-fields";
import { VariantManager } from "@/features/catalogue/variant-manager";
import { ImagesEditor } from "@/features/catalogue/images-editor";

/**
 * Édition d'un produit.
 *
 * Les champs scalaires et la structure de déclinaison sont pilotés
 * séparément : modifier un prix ne doit pas réécrire les variantes, et
 * ajouter une taille ne doit pas exiger de renvoyer tout le produit.
 */
const ProductEditPage = () => {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { can } = useAuth();
	const { notify, notifyError } = useToast();

	const [fields, setFields] = useState<ProductFieldsState | null>(null);
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [confirmArchive, setConfirmArchive] = useState(false);

	const { data: product, isLoading, error, refetch } = useQuery({
		queryKey: ["product", id],
		queryFn: () => api.get<Product>(`/api/admin/products/${id}`),
	});

	const { data: categories } = useQuery({
		queryKey: ["categories", "flat"],
		queryFn: () =>
			api.get<Paginated<Category>>("/api/admin/categories?limit=100&status=active"),
	});

	// Le formulaire est initialisé une fois le produit chargé, puis laissé à
	// l'utilisateur : le réinitialiser à chaque rafraîchissement effacerait sa
	// saisie en cours.
	useEffect(() => {
		if (product && !fields) setFields(productToFields(product));
	}, [product, fields]);

	const save = useMutation({
		mutationFn: () => api.patch<Product>(`/api/admin/products/${id}`, toProductPayload(fields!)),
		onSuccess: (updated) => {
			void queryClient.invalidateQueries({ queryKey: ["product", id] });
			void queryClient.invalidateQueries({ queryKey: ["products"] });
			setErrors({});
			notify(`« ${updated.name} » enregistré.`);
		},
		onError: (caught) => {
			if (caught instanceof ApiRequestError && caught.details) setErrors(caught.details);
			notifyError(caught, "Enregistrement impossible.");
		},
	});

	const duplicate = useMutation({
		mutationFn: () =>
			api.post<Product>(`/api/admin/products/${id}/duplicate`, { includeImages: true }),
		onSuccess: (copy) => {
			void queryClient.invalidateQueries({ queryKey: ["products"] });
			notify("Produit dupliqué en brouillon, stock à zéro.");
			router.push(`/catalogue/${copy.id}`);
		},
		onError: (caught) => notifyError(caught, "Duplication impossible."),
	});

	const archive = useMutation({
		mutationFn: () => api.delete(`/api/admin/products/${id}`),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["products"] });
			notify("Produit archivé.");
			router.push("/catalogue");
		},
		onError: (caught) => notifyError(caught, "Archivage impossible."),
	});

	if (isLoading || !product || !fields) {
		return error ? (
			<Card>
				<ErrorState
					message={error instanceof Error ? error.message : "Produit introuvable."}
					retry={() => void refetch()}
				/>
			</Card>
		) : (
			<Spinner label="Chargement du produit…" />
		);
	}

	const writable = can(PERMISSIONS.catalog.write);

	return (
		<>
			<PageHeader
				title={product.name}
				description={`${product.kind === "variant" ? "Produit à variantes" : "Produit simple"} · ${product.slug}`}
				backHref="/catalogue"
				backLabel="Catalogue"
				actions={
					<>
						<Badge tone={contentStatusTone(product.status)}>
							{CONTENT_STATUS_LABELS[product.status]}
						</Badge>
						<Badge tone={stockStatusTone(product.stockStatus)}>
							{STOCK_STATUS_LABELS[product.stockStatus]} · {product.availableQuantity}
						</Badge>

						{writable && (
							<Button onClick={() => duplicate.mutate()} loading={duplicate.isPending}>
								<IconCopy width={16} height={16} />
								Dupliquer
							</Button>
						)}

						{can(PERMISSIONS.catalog.delete) && !product.archivedAt && (
							<Button variant="danger" onClick={() => setConfirmArchive(true)}>
								<IconTrash width={16} height={16} />
								Archiver
							</Button>
						)}

						{writable && (
							<Button
								variant="primary"
								onClick={() => save.mutate()}
								loading={save.isPending}
							>
								Enregistrer
							</Button>
						)}
					</>
				}
			/>

			{product.archivedAt && (
				<Card className="mb-4 border-warning p-4">
					<p className="text-[13px] text-warning">
						Ce produit est archivé : il n’apparaît plus sur la boutique. Ses commandes
						passées restent intactes.
					</p>
				</Card>
			)}

			<div className="flex flex-col gap-4">
				<Card>
					<CardHeader title="Informations" />
					<div className="p-4">
						<ProductFields
							value={fields}
							onChange={setFields}
							categories={categories?.data ?? []}
							errors={errors}
						/>
					</div>
				</Card>

				<ImagesEditor product={product} disabled={!writable} />

				<VariantManager product={product} disabled={!writable} />

				<Card>
					<CardHeader
						title="Stock"
						description="Les quantités se modifient depuis le module Stocks, avec un motif obligatoire."
						action={
							<Button size="sm" onClick={() => router.push(`/stocks?productId=${product.id}`)}>
								Ouvrir dans Stocks
							</Button>
						}
					/>
					<ul className="divide-y divide-[var(--border)]">
						{product.kind === "variant"
							? product.variants.flatMap((variant) =>
									variant.sizes.length > 0
										? variant.sizes.map((size) => (
												<li
													key={size.id}
													className="flex items-center gap-3 px-4 py-2.5 text-[13px]"
												>
													<span className="flex-1 text-ink">
														{variant.name} · {size.label}
													</span>
													<Badge tone={stockStatusTone(size.stockStatus)}>
														{size.availableQuantity}
													</Badge>
												</li>
											))
										: [
												<li
													key={variant.id}
													className="flex items-center gap-3 px-4 py-2.5 text-[13px]"
												>
													<span className="flex-1 text-ink">{variant.name}</span>
													<Badge tone={stockStatusTone(variant.stockStatus)}>
														{variant.availableQuantity}
													</Badge>
												</li>,
											],
								)
							: product.sizes.length > 0
								? product.sizes.map((size) => (
										<li
											key={size.id}
											className="flex items-center gap-3 px-4 py-2.5 text-[13px]"
										>
											<span className="flex-1 text-ink">{size.label}</span>
											<Badge tone={stockStatusTone(size.stockStatus)}>
												{size.availableQuantity}
											</Badge>
										</li>
									))
								: [
										<li key="single" className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
											<span className="flex-1 text-ink">Sans déclinaison</span>
											<Badge tone={stockStatusTone(product.stockStatus)}>
												{product.availableQuantity}
											</Badge>
										</li>,
									]}
					</ul>
				</Card>

				<Card>
					<CardHeader title="Aperçu" />
					<div className="flex items-center gap-4 p-4">
						<Thumb src={product.images[0]?.url} alt={product.name} />
						<div className="min-w-0">
							<p className="truncate font-medium text-ink">{product.name}</p>
							<p className="text-[13px] text-muted">
								{formatMoney(product.basePrice, product.currency)}
								{product.compareAtPrice && (
									<span className="ml-2 text-subtle line-through">
										{formatMoney(product.compareAtPrice, product.currency)}
									</span>
								)}
							</p>
						</div>
					</div>
				</Card>
			</div>

			<ConfirmDialog
				open={confirmArchive}
				onClose={() => setConfirmArchive(false)}
				onConfirm={() => archive.mutate()}
				loading={archive.isPending}
				title="Archiver ce produit ?"
				message="Il disparaîtra de la boutique mais restera consultable ici, et ses commandes passées ne sont pas affectées. L'opération est réversible."
				confirmLabel="Archiver"
			/>
		</>
	);
};

export default ProductEditPage;
