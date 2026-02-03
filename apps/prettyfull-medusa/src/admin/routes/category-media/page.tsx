import { Container, Heading } from "@medusajs/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CategoryMediaModal } from "../../components/category-media/category-media-modal";
import { sdk } from "../../lib/sdk";
import { CategoryImage } from "../../type";

type CategoryImagesResponse = {
	category_images: CategoryImage[];
};

const queryClient = new QueryClient();

const CategoryMediaPage = () => {
	const { id } = useParams<{ id: string }>();
	const [images, setImages] = useState<CategoryImage[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchImages = async () => {
		if (!id) return;
		try {
			setIsLoading(true);
			const result = await sdk.client.fetch<CategoryImagesResponse>(
				`/admin/categories/${id}/images`,
			);
			setImages(result?.category_images || []);
		} catch (error) {
			console.error("Failed to fetch category images:", error);
			setImages([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchImages();
	}, [id]);

	if (!id) {
		return <div>Category ID not found</div>;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<Container>
				<div className="flex justify-between items-center mb-4">
					<Heading level="h1">Category Media</Heading>
				</div>
				{!isLoading && (
					<CategoryMediaModal
						categoryId={id}
						existingImages={images}
						onSuccess={fetchImages}
					/>
				)}
			</Container>
		</QueryClientProvider>
	);
};

export default CategoryMediaPage;
