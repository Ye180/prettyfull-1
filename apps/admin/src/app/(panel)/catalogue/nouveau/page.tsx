"use client";

import type { Category, Paginated, Product } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiRequestError, api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { Button, Card, CardHeader } from "@/components/ui/primitives";
import {
	ProductFields,
	emptyProductFields,
	toProductPayload,
	type ProductFieldsState,
} from "@/features/catalogue/product-fields";
import {
	StructureEditor,
	emptyStructure,
	toStructurePayload,
	type StructureState,
} from "@/features/catalogue/structure-editor";

/** Création d'un produit (§2.1, §2.2). */
const NewProductPage = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { notify, notifyError } = useToast();

	const [fields, setFields] =
		useState<ProductFieldsState>(emptyProductFields());
	const [structure, setStructure] = useState<StructureState>(emptyStructure());
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	const { data: categories } = useQuery({
		queryKey: ["categories", "flat"],
		queryFn: () =>
			api.get<Paginated<Category>>(
				"/api/admin/categories?limit=100&status=active",
			),
	});

	const create = useMutation({
		mutationFn: () =>
			api.post<Product>("/api/admin/products", {
				...toProductPayload(fields),
				...toStructurePayload(structure),
			}),
		onSuccess: (product) => {
			void queryClient.invalidateQueries({ queryKey: ["products"] });
			notify(`« ${product.name} » créé.`);
			router.push(`/catalogue/${product.id}`);
		},
		onError: (error) => {
			// Les erreurs de validation sont replacées sous leur champ ; les
			// autres passent par une notification.
			if (error instanceof ApiRequestError && error.details) {
				setErrors(error.details);
				notifyError(error, "Le formulaire contient des erreurs.");
			} else {
				notifyError(error, "Création impossible.");
			}
		},
	});

	return (
		<>
			<PageHeader
				title="Nouveau produit"
				backHref="/catalogue"
				backLabel="Catalogue"
				actions={
					<>
						<Button onClick={() => router.push("/catalogue")}>Annuler</Button>
						<Button
							variant="primary"
							onClick={() => {
								setErrors({});
								create.mutate();
							}}
							loading={create.isPending}
						>
							Créer le produit
						</Button>
					</>
				}
			/>

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

				<Card>
					<CardHeader
						title="Déclinaisons et stock"
						description="Un produit est soit simple, soit à variantes - jamais les deux."
					/>
					<div className="p-4">
						<StructureEditor value={structure} onChange={setStructure} />
					</div>
				</Card>

				{Object.keys(errors).length > 0 && (
					<Card className="border-danger p-4">
						<p className="text-[13px] font-medium text-danger">
							Le formulaire n’a pas pu être envoyé
						</p>
						<ul className="mt-1.5 space-y-0.5 text-[13px] text-danger">
							{Object.entries(errors).map(([field, messages]) => (
								<li key={field}>
									{field} : {messages.join(", ")}
								</li>
							))}
						</ul>
					</Card>
				)}
			</div>
		</>
	);
};

export default NewProductPage;
