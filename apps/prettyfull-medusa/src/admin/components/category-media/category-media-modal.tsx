import { CommandBar } from "@medusajs/ui";
import { useRef, useState } from "react";

import { Button, FocusModal, Heading, toast } from "@medusajs/ui";

import { useCategoryImageMutations } from "../../hooks/use-category-image";
import { CategoryImage, UploadedFile } from "../../type";
import { CategoryImageGallery } from "./category-image-gallery";
import { CategoryImageUpload } from "./category-image-upload";

type CategoryMediaModalProps = {
	categoryId: string;
	existingImages: CategoryImage[];
	onSuccess?: () => void;
};

export const CategoryMediaModal = ({
	categoryId,
	existingImages,
	onSuccess,
}: CategoryMediaModalProps) => {
	const [open, setOpen] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
	const [currentThumbnailId, setCurrentThumbnailId] = useState<string | null>(
		null,
	);
	const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
		new Set(),
	);
	const [imagesToDelete, setImagesToDelete] = useState<Set<string>>(new Set());
	const fileInputRef = useRef<HTMLInputElement>(null!);

	const {
		uploadFilesMutation,
		createImagesMutation,
		updateImagesMutation,
		deleteImagesMutation,
	} = useCategoryImageMutations({
		categoryId,
		onUpdateSuccess: () => {
			setSelectedImageIds(new Set());
		},
		onDeleteSuccess: (deletedIds) => {
			setSelectedImageIds(new Set());
			if (currentThumbnailId && deletedIds.includes(currentThumbnailId)) {
				setCurrentThumbnailId(null);
			}
		},
	});

	// L'upload doit bloquer la sauvegarde : sinon on peut cliquer "Save" avant
	// que `uploadedFiles` soit peuplé (onSuccess pas encore déclenché) et fermer
	// le modal sans persister les images tout juste uploadées.
	const isSaving =
		uploadFilesMutation.isPending ||
		createImagesMutation.isPending ||
		updateImagesMutation.isPending ||
		deleteImagesMutation.isPending;

	// Types et taille autorisés côté client (le drop bypassait l'attribut accept).
	const ACCEPTED_IMAGE_TYPES = [
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/heic",
	];
	const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

	const resetModalState = () => {
		setUploadedFiles([]);
		setCurrentThumbnailId(null);
		setImagesToDelete(new Set());
		setSelectedImageIds(new Set());
	};

	const initializeThumbnail = () => {
		const thumbnailImage = existingImages.find(
			(img) => img.type === "thumbnail",
		);
		if (thumbnailImage?.id) {
			setCurrentThumbnailId(thumbnailImage.id);
		}
	};

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (isOpen) {
			initializeThumbnail();
		} else {
			resetModalState();
		}
	};

	const handleUploadFile = (files: FileList | null) => {
		if (!files || files.length === 0) {
			return;
		}
		const filesArray = Array.from(files);

		// Validation type + taille (le chemin drag-and-drop ne passe pas par
		// l'attribut `accept` du picker).
		const invalid = filesArray.filter(
			(f) => !ACCEPTED_IMAGE_TYPES.includes(f.type) || f.size > MAX_FILE_SIZE,
		);
		if (invalid.length > 0) {
			toast.error(
				`Fichier(s) refusé(s) : ${invalid
					.map((f) => f.name)
					.join(", ")} — image (jpeg/png/gif/webp/heic) de 10 Mo max requise.`,
			);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		uploadFilesMutation.mutate(filesArray, {
			onSuccess: (data) => {
				setUploadedFiles((prev) => [...prev, ...data.files]);
			},
			onError: () => {
				toast.error("Échec de l'upload des fichiers. Veuillez réessayer.");
			},
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSave = async () => {
		const hasNewImages = uploadedFiles.length > 0;
		const hasImagesToDelete = imagesToDelete.size > 0;

		const initialThumbnail = existingImages.find(
			(img) => img.type === "thumbnail",
		);
		const thumbnailChanged =
			currentThumbnailId &&
			!currentThumbnailId.startsWith("uploaded:") &&
			currentThumbnailId !== initialThumbnail?.id;

		if (!hasNewImages && !hasImagesToDelete && !thumbnailChanged) {
			setOpen(false);
			return;
		}

		try {
			const operations: Array<Promise<unknown>> = [];
			if (hasNewImages) {
				const imagesToCreate = uploadedFiles.map((file) => ({
					url: file.url,
					file_id: file.id,
					type:
						file.type ||
						(currentThumbnailId === `uploaded:${file.id}`
							? "thumbnail"
							: "image"),
				}));
				operations.push(createImagesMutation.mutateAsync(imagesToCreate));
			}

			// Update thumbnail if changed and it's not an uploaded file
			if (
				thumbnailChanged &&
				!(hasNewImages && currentThumbnailId?.startsWith("uploaded:"))
			) {
				const updates = [
					{
						id: currentThumbnailId,
						type: "thumbnail" as const,
					},
				];
				operations.push(updateImagesMutation.mutateAsync(updates));
			}

			if (hasImagesToDelete) {
				const idsToDelete = Array.from(imagesToDelete);
				operations.push(deleteImagesMutation.mutateAsync(idsToDelete));
			}

			await Promise.all(operations);

			setOpen(false);
			resetModalState();
			onSuccess?.();
			toast.success("Category media saved successfully");
		} catch (error) {
			// En cas d'échec partiel (certaines opérations ont pu réussir), on
			// resynchronise la galerie avec l'état réel du serveur.
			onSuccess?.();
			toast.error("Failed to save changes");
		}
	};

	const handleImageSelection = (id: string, isUploaded: boolean = false) => {
		const itemId = isUploaded ? `uploaded:${id}` : id;
		const newSelected = new Set(selectedImageIds);
		if (newSelected.has(itemId)) {
			newSelected.delete(itemId);
		} else {
			newSelected.add(itemId);
		}
		setSelectedImageIds(newSelected);
	};

	const handleSetAsThumbnail = () => {
		if (selectedImageIds.size !== 1) {
			return;
		}

		const selectedId = Array.from(selectedImageIds)[0];
		setCurrentThumbnailId(selectedId);
		if (selectedId.startsWith("uploaded:")) {
			// update uploaded file type to thumbnail
			const uploadedFileId = selectedId.replace("uploaded:", "");
			setUploadedFiles((prev) =>
				prev.map((file) => {
					return file.id === uploadedFileId
						? { ...file, type: "thumbnail" }
						: file;
				}),
			);
		}

		setSelectedImageIds(new Set());
	};

	const handleDelete = () => {
		if (selectedImageIds.size === 0) {
			return;
		}

		const uploadedFileIds: string[] = [];
		const savedImageIds: string[] = [];

		selectedImageIds.forEach((id) => {
			if (id.startsWith("uploaded:")) {
				uploadedFileIds.push(id.replace("uploaded:", ""));
			} else {
				savedImageIds.push(id);
			}
		});

		if (uploadedFileIds.length > 0) {
			setUploadedFiles((prev) =>
				prev.filter((file) => !uploadedFileIds.includes(file.id)),
			);
			if (currentThumbnailId?.startsWith("uploaded:")) {
				const thumbnailFileId = currentThumbnailId.replace("uploaded:", "");
				if (uploadedFileIds.includes(thumbnailFileId)) {
					setCurrentThumbnailId(null);
				}
			}
		}

		if (savedImageIds.length > 0) {
			setImagesToDelete((prev) => {
				const newSet = new Set(prev);
				savedImageIds.forEach((id) => newSet.add(id));
				return newSet;
			});
			if (currentThumbnailId && savedImageIds.includes(currentThumbnailId)) {
				setCurrentThumbnailId(null);
			}
		}

		setSelectedImageIds(new Set());
	};

	return (
		<FocusModal open={open} onOpenChange={handleOpenChange}>
			<FocusModal.Trigger asChild>
				<Button size="small" variant="secondary">
					Edit
				</Button>
			</FocusModal.Trigger>

			<FocusModal.Content>
				<FocusModal.Header>
					<Heading>Edit Media</Heading>
				</FocusModal.Header>

				<FocusModal.Body className="flex overflow-hidden h-full">
					<div className="flex w-full h-full flex-col-reverse lg:grid lg:grid-cols-[1fr_560px]">
						<CategoryImageGallery
							existingImages={existingImages}
							uploadedFiles={uploadedFiles}
							currentThumbnailId={currentThumbnailId}
							selectedImageIds={selectedImageIds}
							onToggleSelect={handleImageSelection}
							imagesToDelete={imagesToDelete}
						/>
						<CategoryImageUpload
							fileInputRef={fileInputRef}
							isUploading={uploadFilesMutation.isPending}
							onFileSelect={handleUploadFile}
						/>
					</div>
					<CommandBar open={selectedImageIds.size > 0}>
						<CommandBar.Bar>
							<CommandBar.Value>
								{selectedImageIds.size} selected
							</CommandBar.Value>
							<CommandBar.Seperator />
							<CommandBar.Command
								action={handleSetAsThumbnail}
								label="Set as thumbnail"
								shortcut="t"
								disabled={selectedImageIds.size !== 1}
							/>
							<CommandBar.Seperator />
							<CommandBar.Command
								action={handleDelete}
								label="Delete"
								shortcut="d"
							/>
						</CommandBar.Bar>
					</CommandBar>
				</FocusModal.Body>
				<FocusModal.Footer>
					<div className="flex gap-x-2 justify-end items-center">
						<FocusModal.Close asChild>
							<Button size="small" variant="secondary">
								Cancel
							</Button>
						</FocusModal.Close>
						<Button size="small" onClick={handleSave} isLoading={isSaving}>
							Save
						</Button>
					</div>
				</FocusModal.Footer>
			</FocusModal.Content>
		</FocusModal>
	);
};
