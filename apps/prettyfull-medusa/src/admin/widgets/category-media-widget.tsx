import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { ThumbnailBadge } from "@medusajs/icons";
import { AdminProductCategory, DetailWidgetProps } from "@medusajs/types";
import { Container, Heading } from "@medusajs/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CategoryMediaModal } from "../components/category-media/category-media-modal";
import { useCategoryImages } from "../hooks/use-category-image";
import { withGarageViewParam } from "../lib/garage-url";
import { CategoryImage } from "../type";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
});

const CategoryMediaWidgetContent = ({
	data,
}: DetailWidgetProps<AdminProductCategory>) => {
	const { data: images = [], isLoading, refetch } = useCategoryImages(data.id);

	return (
		<Container className="p-0 divide-y">
			<div className="flex justify-between items-center px-6 py-4">
				<Heading level="h2">Media</Heading>
				{!isLoading && (
					<CategoryMediaModal
						categoryId={data.id}
						existingImages={images}
						onSuccess={() => refetch()}
					/>
				)}
			</div>
			<div className="px-6 py-4">
				<div className="grid grid-cols-[repeat(auto-fill,96px)] gap-4">
					{isLoading && (
						<div className="col-span-full">
							<p className="text-sm text-ui-fg-subtle">Loading...</p>
						</div>
					)}
					{!isLoading && images.length === 0 && (
						<div className="col-span-full">
							<p className="text-sm text-ui-fg-subtle">No images added yet</p>
						</div>
					)}
					{images.map((image: CategoryImage) => (
						<div
							key={image.id}
							className="overflow-hidden relative rounded-lg border aspect-square border-ui-border-base bg-ui-bg-subtle"
						>
							<img
								src={withGarageViewParam(image.url)}
								alt={`Category ${image.type}`}
								className="object-cover w-full h-full"
							/>
							{image.type === "thumbnail" && (
								<div className="absolute top-2 left-2">
									<ThumbnailBadge />
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</Container>
	);
};

const CategoryMediaWidget = (
	props: DetailWidgetProps<AdminProductCategory>,
) => {
	return (
		<QueryClientProvider client={queryClient}>
			<CategoryMediaWidgetContent {...props} />
		</QueryClientProvider>
	);
};

export const config = defineWidgetConfig({
	zone: "product_category.details.after",
});

export default CategoryMediaWidget;
