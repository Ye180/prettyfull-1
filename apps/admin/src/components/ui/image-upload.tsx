"use client";

import type { UploadEndpoint } from "@prettyfull/contracts";
import { cn } from "@prettyfull/utils";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState, type DragEvent } from "react";
import { api } from "@/lib/api";
import { mediaUrl } from "@/lib/media";
import { useUpload } from "@/lib/uploads";
import { useToast } from "@/components/ui/toast";
import { Button, Input, Spinner } from "./primitives";
import { IconTrash, IconUpload } from "@/components/icons";

/**
 * Téléversement de visuels.
 *
 * Envoi direct vers Cloudflare R2 via `useUpload` (URL signée par l'API).
 *
 * Le champ d'URL manuelle reste disponible en repli - le stockage peut ne pas
 * être configuré, et certaines images vivent déjà dans `apps/web/public`.
 */

/** Le panel demande à l'API si le stockage est branché avant de l'annoncer. */
export const useUploadAvailable = () => {
	const { data } = useQuery({
		queryKey: ["uploads", "status"],
		queryFn: () =>
			api.get<{ configured: boolean }>("/api/admin/uploads/status"),
		staleTime: 5 * 60 * 1000,
	});

	return data?.configured ?? false;
};

/** Destinations du back-office (les photos d'avis passent par le storefront). */
type CatalogOrContent = Exclude<UploadEndpoint, "reviewPhoto">;

interface ImageUploadProps {
	endpoint: CatalogOrContent;
	/** URL courante ; chaîne vide quand aucune image n'est choisie. */
	value: string;
	onChange: (url: string) => void;
	disabled?: boolean;
	label?: string;
	className?: string;
}

export const ImageUpload = ({
	endpoint,
	value,
	onChange,
	disabled = false,
	className,
}: ImageUploadProps) => {
	const { notify, notifyError } = useToast();
	const available = useUploadAvailable();

	const inputRef = useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = useState(false);

	const { upload: send, isUploading } = useUpload(endpoint);

	const upload = useCallback(
		async (files: File[]) => {
			const image = files.find((file) => file.type.startsWith("image/"));

			if (!image) {
				notifyError(new Error("Seules les images sont acceptées."));
				return;
			}

			try {
				const [url] = await send([image]);
				if (!url) return;
				onChange(url);
				notify("Visuel téléversé.");
			} catch (error) {
				notifyError(error, "Téléversement impossible.");
			}
		},
		[send, onChange, notify, notifyError],
	);

	const onDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragging(false);
		if (disabled || isUploading) return;
		void upload([...event.dataTransfer.files]);
	};

	const preview = mediaUrl(value);

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div className="flex items-start gap-3">
				<div className="size-20 shrink-0 overflow-hidden rounded-md border border-line bg-sunken">
					{preview && (
						/*
						 * Les visuels viennent du storefront ou du stockage R2, et une URL
						 * collée à la main peut venir de n'importe où : `next/image`
						 * exigerait une liste d'hôtes à maintenir.
						 */
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={preview}
							alt=""
							className="size-full object-cover"
							onError={(event) => {
								event.currentTarget.style.visibility = "hidden";
							}}
						/>
					)}
				</div>

				<div className="flex min-w-0 flex-1 flex-col gap-2">
					{available && !disabled && (
						<div
							onDragOver={(event) => {
								event.preventDefault();
								setDragging(true);
							}}
							onDragLeave={() => setDragging(false)}
							onDrop={onDrop}
							className={cn(
								"flex items-center justify-center gap-2 rounded-md border border-dashed px-3 py-3 text-[13px] transition-colors",
								dragging
									? "border-line-strong bg-accent-soft text-ink"
									: "border-line text-muted",
							)}
						>
							{isUploading ? (
								<Spinner label="Téléversement…" />
							) : (
								<>
									<IconUpload width={15} height={15} />
									<span>Glissez une image ici, ou</span>
									<button
										type="button"
										onClick={() => inputRef.current?.click()}
										className="font-medium text-ink underline underline-offset-2 hover:no-underline"
									>
										parcourez
									</button>
								</>
							)}
						</div>
					)}

					<div className="flex items-center gap-2">
						<Input
							value={value}
							disabled={disabled}
							onChange={(event) => onChange(event.target.value)}
							placeholder={
								available
									? "…ou collez une URL / un chemin public"
									: "/home/arrivals-1.jpg ou https://…"
							}
							aria-label="URL du visuel"
						/>

						{value && !disabled && (
							<Button
								variant="ghost"
								onClick={() => onChange("")}
								aria-label="Retirer le visuel"
							>
								<IconTrash width={16} height={16} />
							</Button>
						)}
					</div>
				</div>
			</div>

			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(event) => {
					void upload([...(event.target.files ?? [])]);
					// Réinitialisé pour que re-sélectionner le même fichier
					// redéclenche bien l'événement.
					event.target.value = "";
				}}
			/>
		</div>
	);
};

/**
 * Téléversement multiple, pour une galerie.
 *
 * Les fichiers déposés s'ajoutent à la liste existante plutôt que de la
 * remplacer : on complète une galerie bien plus souvent qu'on ne la refait.
 */
export const ImageUploadList = ({
	endpoint,
	values,
	onChange,
	disabled = false,
}: {
	endpoint: CatalogOrContent;
	values: string[];
	onChange: (urls: string[]) => void;
	disabled?: boolean;
}) => {
	const { notify, notifyError } = useToast();
	const available = useUploadAvailable();
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = useState(false);

	const { upload: send, isUploading } = useUpload(endpoint);

	const upload = async (files: File[]) => {
		const images = files.filter((file) => file.type.startsWith("image/"));
		if (images.length === 0) {
			notifyError(new Error("Seules les images sont acceptées."));
			return;
		}

		try {
			const urls = await send(images);
			onChange([...values.filter(Boolean), ...urls]);
			notify(`${urls.length} visuel(s) ajouté(s).`);
		} catch (error) {
			notifyError(error, "Téléversement impossible.");
		}
	};

	return (
		<div className="flex flex-col gap-3">
			{values.map((url, index) => (
				<div key={`${url}-${index}`} className="flex items-center gap-2">
					<div className="size-10 shrink-0 overflow-hidden rounded border border-line bg-sunken">
						{url.trim() && (
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
							onChange(
								values.map((item, i) =>
									i === index ? event.target.value : item,
								),
							)
						}
						placeholder="/home/arrivals-1.jpg"
						aria-label={`Visuel ${index + 1}`}
					/>

					{!disabled && (
						<Button
							variant="ghost"
							onClick={() => onChange(values.filter((_, i) => i !== index))}
							aria-label="Retirer ce visuel"
						>
							<IconTrash width={16} height={16} />
						</Button>
					)}
				</div>
			))}

			{!disabled && (
				<>
					{available ? (
						<div
							onDragOver={(event) => {
								event.preventDefault();
								setDragging(true);
							}}
							onDragLeave={() => setDragging(false)}
							onDrop={(event) => {
								event.preventDefault();
								setDragging(false);
								if (!isUploading) void upload([...event.dataTransfer.files]);
							}}
							className={cn(
								"flex items-center justify-center gap-2 rounded-md border border-dashed px-3 py-4 text-[13px] transition-colors",
								dragging
									? "border-line-strong bg-accent-soft text-ink"
									: "border-line text-muted",
							)}
						>
							{isUploading ? (
								<Spinner label="Téléversement…" />
							) : (
								<>
									<IconUpload width={15} height={15} />
									<span>Glissez vos images ici, ou</span>
									<button
										type="button"
										onClick={() => inputRef.current?.click()}
										className="font-medium text-ink underline underline-offset-2 hover:no-underline"
									>
										parcourez
									</button>
								</>
							)}
						</div>
					) : (
						<Button
							size="sm"
							onClick={() => onChange([...values, ""])}
							className="self-start"
						>
							Ajouter une URL
						</Button>
					)}

					<input
						ref={inputRef}
						type="file"
						accept="image/*"
						multiple
						className="hidden"
						onChange={(event) => {
							void upload([...(event.target.files ?? [])]);
							event.target.value = "";
						}}
					/>
				</>
			)}
		</div>
	);
};
