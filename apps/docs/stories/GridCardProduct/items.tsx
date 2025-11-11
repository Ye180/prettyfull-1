"use client";

import { CardProduct } from "@prettyfull/ui";

export const ItemsCardProduct = () => {
	const products = [
		{
			id: "sweet-top-1",
			name: "Sweet-Top",
			description: "Top polyvalente à manche",
			price: { amount: 12000, currency: "XOF" },
			promotion: {
				pourcentage: 50,
				reduced_price: { amount: 6000, currency: "XOF" },
			},
			notVariable: {
				color: { code: "#FF0000", label: "Rouge" },
				image: ["/assets/product_1.jpg"],
				quantity: 1,
				size: ["S", "M", "L"],
			},
		},
		{
			id: "sweet-top-2",
			name: "Sweet-Top Bleu",
			description: "Top élégant à manche longue",
			price: { amount: 15000, currency: "XOF" },
			promotion: {
				pourcentage: 30,
				reduced_price: { amount: 10500, currency: "XOF" },
			},
			notVariable: {
				color: { code: "#0000FF", label: "Bleu" },
				image: ["/assets/product_2.jpg"],
				quantity: 1,
				size: ["S", "M", "L"],
			},
		},
		{
			id: "sweet-top-3",
			name: "Sweet-Top Vert",
			description: "Top confortable vert clair",
			price: { amount: 10000, currency: "XOF" },
			promotion: {
				pourcentage: 20,
				reduced_price: { amount: 8000, currency: "XOF" },
			},
			notVariable: {
				color: { code: "#00FF00", label: "Vert" },
				image: ["/assets/product_3.jpg"],
				quantity: 1,
				size: ["S", "M", "L"],
			},
		},
		{
			id: "sweet-top-4",
			name: "Sweet-Top Rose",
			description: "Top pastel doux",
			price: { amount: 9000, currency: "XOF" },
			promotion: {
				pourcentage: 10,
				reduced_price: { amount: 8100, currency: "XOF" },
			},
			notVariable: {
				color: { code: "#FFC0CB", label: "Rose" },
				image: ["/assets/product_4.jpg"],
				quantity: 1,
				size: ["S", "M", "L"],
			},
		},
		{
			id: "sweet-top-5",
			name: "Sweet-Top Jaune",
			description: "Top stylé jaune clair",
			price: { amount: 11000, currency: "XOF" },
			promotion: {
				pourcentage: 15,
				reduced_price: { amount: 9350, currency: "XOF" },
			},
			notVariable: {
				color: { code: "#FFD700", label: "Jaune" },
				image: ["/assets/product_5.jpg"],
				quantity: 1,
				size: ["S", "M", "L"],
			},
		},
		{
			id: "sweet-top-6",
			name: "Sweet-Top Noir",
			description: "Top classique noir uni",
			price: { amount: 13000, currency: "XOF" },
			promotion: {
				pourcentage: 40,
				reduced_price: { amount: 7800, currency: "XOF" },
			},
			notVariable: {
				color: { code: "#000000", label: "Noir" },
				image: ["/assets/product_6.jpg"],
				quantity: 1,
				size: ["S", "M", "L"],
			},
		},
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
			{products.map((product) => (
				<CardProduct
					key={product.id}
					productId={product.id}
					name={product.name}
					smallDescription={product.description}
					price={product.price}
					promotion={product.promotion}
					notVariable={product.notVariable}
					link={`/products/${product.id}`}
				/>
			))}
		</div>
	);
};
