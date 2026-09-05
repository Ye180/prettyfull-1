"use client";

import type { Product } from "@prettyfull/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Button, Card, CardHeader, Input } from "@/components/ui/primitives";
import { IconPlus, IconTrash } from "@/components/icons";
import { mediaUrl } from "@/lib/media";

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

	const [urls, setUrls] = useState<string[]>(
		product.images.length > 0 ? product.images.map((image) => image.url) : [""],
	);

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

			<div className="flex flex-col gap-2 p-4">
				{urls.map((url, index) => (
					<div key={index} className="flex items-center gap-2">
						<div className="size-10 shrink-0 overflow-hidden rounded border border-line bg-sunken">
							{url.trim() && (
								/*
								 * URL saisies librement par l'administrateur, inconnues à la
								 * compilation : `next/image` exigerait une liste d'hôtes.
								 */
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={mediaUrl(url) ?? ""}
									alt=""
									className="size-full object-cover"
									onError={(event) => {
										event.currentTarget.style.visibility = "hidden";
									}}
								/>
							)}
						</div>

						<Input
							value={url}
							disabled={disabled}
							onChange={(event) =>
								setUrls(urls.map((item, i) => (i === index ? event.target.value : item)))
							}
							placeholder="/home/arrivals-1.jpg"
						/>

						{!disabled && urls.length > 1 && (
							<Button
								variant="ghost"
								onClick={() => setUrls(urls.filter((_, i) => i !== index))}
								aria-label="Retirer l'image"
							>
								<IconTrash width={16} height={16} />
							</Button>
						)}
					</div>
				))}

				{!disabled && (
					<Button size="sm" onClick={() => setUrls([...urls, ""])} className="self-start">
						<IconPlus width={14} height={14} />
						Ajouter une image
					</Button>
				)}
			</div>
		</Card>
	);
};
