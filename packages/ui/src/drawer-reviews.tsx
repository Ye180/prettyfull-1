"use client";

import { cn } from "@prettyfull/utils";
import { useState } from "react";
import { Button } from "./button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTrigger,
} from "./components/ui/drawer";
import { CloseIcon } from "./icons/close.icon";
import { StarIcon } from "./icons/star.icon";

/**
 * Formulaire de soumission d'un avis produit.
 *
 * Reste purement présentatif : les appels réseau (téléversement des photos,
 * envoi de l'avis) sont préparés par `use-review-form.ts` côté `apps/web` et
 * passés ici en props — ce paquet ne dépend jamais d'une app en particulier.
 */

export interface ReviewFormValues {
	rating: number;
	authorName: string;
	authorEmail: string;
	body: string;
	photoUrls: string[];
}

const EMPTY_FORM: ReviewFormValues = {
	rating: 0,
	authorName: "",
	authorEmail: "",
	body: "",
	photoUrls: [],
};

const MAX_PHOTOS = 4;

const FIELD_CLASS =
	"w-full rounded-xl border border-neutral-300 bg-white px-5 py-4 text-[1.5rem] " +
	"font-light text-black placeholder:text-neutral-400 transition-colors " +
	"focus:border-black focus:outline-none";

interface DrawerReviewProps {
	onSubmit: (values: ReviewFormValues) => Promise<void>;
	onUploadPhotos: (files: File[]) => Promise<string[]>;
	isSubmitting?: boolean;
	isUploading?: boolean;
	className?: string;
	triggerLabel?: string;
	triggerClassName?: string;
}

const DrawerReview = ({
	onSubmit,
	onUploadPhotos,
	isSubmitting = false,
	isUploading = false,
	className,
	triggerLabel = "Écrire un avis",
	triggerClassName,
}: DrawerReviewProps) => {
	const [form, setForm] = useState<ReviewFormValues>(EMPTY_FORM);
	const [sent, setSent] = useState(false);
	const [open, setOpen] = useState(false);

	const set = <K extends keyof ReviewFormValues>(key: K, value: ReviewFormValues[K]) =>
		setForm((current) => ({ ...current, [key]: value }));

	const handleFiles = async (files: FileList | null) => {
		if (!files || files.length === 0) return;
		const remaining = MAX_PHOTOS - form.photoUrls.length;
		if (remaining <= 0) return;

		const urls = await onUploadPhotos(Array.from(files).slice(0, remaining));
		set("photoUrls", [...form.photoUrls, ...urls].slice(0, MAX_PHOTOS));
	};

	const canSubmit =
		form.rating > 0 && form.authorName.trim() && form.authorEmail.trim() && form.body.trim();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!canSubmit) return;

		await onSubmit({ ...form, authorName: form.authorName.trim(), body: form.body.trim() });
		setForm(EMPTY_FORM);
		setSent(true);
	};

	return (
		<Drawer
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (next) setSent(false);
			}}
		>
			<DrawerTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-fit rounded-full px-8 py-6 text-[1.5rem] font-medium whitespace-nowrap cursor-pointer",
						triggerClassName,
					)}
				>
					{triggerLabel}
				</Button>
			</DrawerTrigger>

			<DrawerContent title="Écrire un avis" className={cn("p-5 border-none outline-none", className)}>
				<DrawerClose
					className="absolute z-30 p-2 text-2xl bg-white rounded-full cursor-pointer right-4 top-4"
					onClick={(event: React.MouseEvent<HTMLButtonElement>) => event.stopPropagation()}
				>
					<CloseIcon className="w-10 h-10" />
				</DrawerClose>

				<div className="w-full max-w-lg px-4 py-8 mx-auto overflow-y-auto">
					{sent ? (
						<div className="py-8 text-center space-y-4">
							<p className="text-[1.8rem] font-medium">Merci pour votre avis !</p>
							<p className="text-[1.4rem] text-gray-500">
								Il sera visible sur la fiche produit dès sa validation par notre équipe.
							</p>
							<Button type="button" variant="outline" onClick={() => setSent(false)}>
								Écrire un autre avis
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<span className="mb-2 block text-[1.4rem] font-medium">Note</span>
								<div className="flex gap-1">
									{[1, 2, 3, 4, 5].map((value) => (
										<button
											key={value}
											type="button"
											onClick={() => set("rating", value)}
											aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
											className="cursor-pointer p-1"
										>
											<StarIcon
												className={cn(
													"w-6 h-6",
													value <= form.rating ? "text-[#ffce31]" : "text-gray-200",
												)}
											/>
										</button>
									))}
								</div>
							</div>

							<input
								required
								type="text"
								placeholder="Votre nom"
								value={form.authorName}
								onChange={(event) => set("authorName", event.target.value)}
								className={FIELD_CLASS}
							/>

							<input
								required
								type="email"
								placeholder="Votre e-mail"
								value={form.authorEmail}
								onChange={(event) => set("authorEmail", event.target.value)}
								className={FIELD_CLASS}
							/>

							<textarea
								required
								rows={4}
								placeholder="Votre avis"
								value={form.body}
								onChange={(event) => set("body", event.target.value)}
								className={cn(FIELD_CLASS, "resize-y")}
							/>

							<div className="space-y-2">
								<span className="block text-[1.4rem] font-medium">
									Photos (facultatif, {form.photoUrls.length}/{MAX_PHOTOS})
								</span>

								{form.photoUrls.length > 0 && (
									<div className="flex gap-2 flex-wrap">
										{form.photoUrls.map((url) => (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												key={url}
												src={url}
												alt=""
												className="w-16 h-16 rounded-xl object-cover border border-gray-200"
											/>
										))}
									</div>
								)}

								{form.photoUrls.length < MAX_PHOTOS && (
									<label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-[1.3rem] text-gray-500 cursor-pointer hover:border-gray-400">
										{isUploading ? "Téléversement…" : "Ajouter une photo"}
										<input
											type="file"
											accept="image/*"
											multiple
											disabled={isUploading}
											className="hidden"
											onChange={(event) => {
												void handleFiles(event.target.files);
												event.target.value = "";
											}}
										/>
									</label>
								)}
							</div>

							<Button
								type="submit"
								disabled={!canSubmit || isSubmitting}
								className="w-full rounded-full py-6 text-[1.5rem] font-medium"
							>
								{isSubmitting ? "Envoi…" : "Envoyer mon avis"}
							</Button>
						</form>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default DrawerReview;
