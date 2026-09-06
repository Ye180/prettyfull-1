"use client";

import { UPLOAD_ENDPOINTS, type Product } from "@prettyfull/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Button, Card, CardHeader } from "@/components/ui/primitives";
import { ImageUploadList } from "@/components/ui/image-upload";

/**
 * Galerie du produit.
 *
 * La liste est envoyée en bloc : l'API remplace la galerie entière, ce qui
 * rend l'ordre et les suppressions triviaux côté client, sans endpoint par
 * image.
 */
export const ImagesEditor = ({
	product,
	disabled,
}: {
	product: Product;
	disabled: boolean;
}) => {
	const queryClient = useQueryClient();
	const { notify, notifyError } = useToast();

	const [urls, setUrls] = useState<string[]>(product.images.map((image) => image.url));

	const save = useMutation({
		mutationFn: () =>
			api.patch(`/api/admin/products/${product.id}`, {
				images: urls
					.map((url) => url.trim())
					.filter(Boolean)
					.map((url, position) => ({ url, position })),
			}),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["product", product.id] });
			notify("Galerie mise à jour.");
		},
		onError: (error) => notifyError(error, "Mise à jour impossible."),
	});

	return (
		<Card>
			<CardHeader
				title="Galerie du produit"
				description="La première image sert de vignette dans les listes."
				action={
					!disabled && (
						<Button size="sm" onClick={() => save.mutate()} loading={save.isPending}>
							Enregistrer la galerie
						</Button>
					)
				}
			/>

			<div className="p-4">
				<ImageUploadList
					endpoint={UPLOAD_ENDPOINTS.catalog}
					values={urls}
					onChange={setUrls}
					disabled={disabled}
				/>
			</div>
		</Card>
	);
};
