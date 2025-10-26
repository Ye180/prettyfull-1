import { PRODUCT_PATHS } from "@/lib/routes/paths-en";
import Title from "@/shared/components/molecules/core/title";
import { CardProduct, GridCardProduct } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const ShopGrid = () => {
	const t = useTranslations("HomePage.news");
	return (
		<Container maxWidth="100vw" className="w-full px-4 space-y-8 lg:px-40">
			<Title title="$4 & UNDER BLOWOUT!" buttonLabel={t("viewAll")} />
			<GridCardProduct>
				<>
					{Array.from({ length: 4 }).map((_, i) => (
						<CardProduct
							variable={[
								{
									color: {
										label: "Rouge",
										code: "#FF0000",
									},
									size: ["S", "M", "L", "XL", "2XL", "3XL"],
									image: [
										"/assets/product_2.webp",
										"/assets/product5.webp",
										"/assets/product_2.webp",
									],
									quantity: 1,
								},
								{
									color: {
										label: "Gris",
										code: "#373B39",
									},
									size: ["S", "M", "L"],
									image: ["/assets/product5.webp", "/assets/product_2.webp"],
									quantity: 1,
								},
								{
									color: {
										label: "Violet",
										code: "#3C2E69",
									},
									size: ["S", "M", "L", "XL", "2XL", "3XL"],
									image: ["/assets/product5.webp", "/assets/product_2.webp"],
									quantity: 1,
								},
								{
									color: {
										label: "Jade",
										code: "#29A383",
									},
									size: ["S", "M", "L"],
									image: [
										"/assets/product_2.webp",
										"/assets/product5.webp",
										"/assets/product_2.webp",
									],
									quantity: 1,
								},
							]}
							price={12000}
							promotion={{
								pourcentage: 50,
								reduced_price: 6000,
							}}
							smallDescription="Top polyvalente á Manche"
							title="Sweet-Top"
							link={PRODUCT_PATHS.productDetail("SWEET-TOP")}
						/>
					))}
				</>
			</GridCardProduct>
		</Container>
	);
};

export default ShopGrid;
