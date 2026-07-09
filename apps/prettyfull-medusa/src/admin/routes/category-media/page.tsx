import { Container, Heading } from "@medusajs/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CategoryMediaModal } from "../../components/category-media/category-media-modal";
import { useCategoryImages } from "../../hooks/use-category-image";

const queryClient = new QueryClient();

const CategoryMediaPageContent = () => {
	const { id } = useParams<{ id: string }>();
	const { data: images = [], isLoading, refetch } = useCategoryImages(id);

	if (!id) {
		return <div>Category ID not found</div>;
	}

	return (
		<Container>
			<div className="flex justify-between items-center mb-4">
				<Heading level="h1">Category Media</Heading>
			</div>
			{!isLoading && (
				<CategoryMediaModal
					categoryId={id}
					existingImages={images}
					onSuccess={() => refetch()}
				/>
			)}
		</Container>
	);
};

const CategoryMediaPage = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<CategoryMediaPageContent />
		</QueryClientProvider>
	);
};

export default CategoryMediaPage;
