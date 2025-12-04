import { Text } from "@medusajs/ui";

import { CategoryImage, UploadedFile } from "../../type";
import { CategoryImageItem } from "./category-image-item";

type CategoryImageGalleryProps = {
	existingImages: CategoryImage[];
	uploadedFiles: UploadedFile[];
	currentThumbnailId: string | null;
	selectedImageIds: Set<string>;
	imagesToDelete: Set<string>;
	onToggleSelect: (id: string, isUploaded·?: boolean) => void;
};

export const CategoryImageGallery = ({
	existingImages,
	uploadedFiles,
	currentThumbnailId,
	selectedImageIds,
	onToggleSelect,
	imagesToDelete,
}: CategoryImageGalleryProps) => {
	// TODO filter deleted images
	const visibleExistingImages = existingImages.filter(
		(image) => image.id && !imagesToDelete.has(image.id)
	);

	const hasNoImages =
		visibleExistingImages.length === 0 && uploadedFiles.length === 0;

	return (
		<div className="overflow-auto bg-ui-bg-subtle size-full">
			<div className="grid grid-cols-4 auto-rows-auto gap-6 p-6 h-fit">
				{/* Existing images */}
				{visibleExistingImages.map((image) => {
					if (!image.id) {
						return null;
					}

					const imageId = image.id;
					const isThumbnail = currentThumbnailId === imageId;

					return (
						<CategoryImageItem
							key={imageId}
							id={imageId}
							url={image.url}
							alt={`Category ${image.type}`}
							isThumbnail={isThumbnail}
							isSelected={selectedImageIds.has(imageId)}
							onToggleSelect={() => onToggleSelect(imageId)}
						/>
					);
				})}

				{/* Newly uploaded files */}
				{uploadedFiles.map((file) => {
					const uploadedId = `uploaded:${file.id}`;
					const isThumbnail = currentThumbnailId === uploadedId;

					return (
						<CategoryImageItem
							key={file.id}
							id={file.id}
							url={file.url}
							alt="Uploaded"
							isThumbnail={isThumbnail}
							isSelected={selectedImageIds.has(uploadedId)}
							onToggleSelect={() => onToggleSelect(file.id, true)}
						/>
					);
				})}

				{/* Empty state */}
				{hasNoImages && (
					<div className="flex col-span-4 justify-center items-center p-8">
						<Text className="text-center text-ui-fg-subtle">
							No images yet. Upload images to get started.
						</Text>
					</div>
				)}
			</div>
		</div>
	);
};
