import type { FakeCategory } from "./types";

// Placeholder catalog for "PrettyFull" (women's fashion). Reuses images
// already shipped in /public — swap for real client photos once she starts
// posting her own catalog.
export const categories: FakeCategory[] = [
	{
		id: "cat_dresses",
		name: "Robes",
		handle: "robes",
		metadata: { name_en: "Dresses" },
		product_category_image: [
			{
				id: "catimg_dresses",
				url: "/category/category-principale.jpg",
				file_id: "category-principale.jpg",
				type: "thumbnail",
				category_id: "cat_dresses",
			},
			{
				id: "catimg_dresses_mobile",
				url: "/home/cover-phone.jpg",
				file_id: "cover-phone.jpg",
				type: "image",
				category_id: "cat_dresses",
			},
		],
	},
	{
		id: "cat_tops",
		name: "Hauts",
		handle: "hauts",
		metadata: { name_en: "Tops" },
		product_category_image: [
			{
				id: "catimg_tops",
				url: "/category/category1.jpg",
				file_id: "category1.jpg",
				type: "thumbnail",
				category_id: "cat_tops",
			},
			{
				id: "catimg_tops_mobile",
				url: "/home/cover-phone.jpg",
				file_id: "cover-phone.jpg",
				type: "image",
				category_id: "cat_tops",
			},
		],
	},
	{
		id: "cat_sets",
		name: "Ensembles",
		handle: "ensembles",
		metadata: { name_en: "Sets" },
		product_category_image: [
			{
				id: "catimg_sets",
				url: "/home/arrivals-1.jpg",
				file_id: "arrivals-1.jpg",
				type: "thumbnail",
				category_id: "cat_sets",
			},
			{
				id: "catimg_sets_mobile",
				url: "/home/cover-phone.jpg",
				file_id: "cover-phone.jpg",
				type: "image",
				category_id: "cat_sets",
			},
		],
	},
	{
		id: "cat_accessories",
		name: "Accessoires",
		handle: "accessoires",
		metadata: { name_en: "Accessories" },
		product_category_image: [
			{
				id: "catimg_accessories",
				url: "/home/arrivals-2.jpg",
				file_id: "arrivals-2.jpg",
				type: "thumbnail",
				category_id: "cat_accessories",
			},
			{
				id: "catimg_accessories_mobile",
				url: "/home/cover-phone.jpg",
				file_id: "cover-phone.jpg",
				type: "image",
				category_id: "cat_accessories",
			},
		],
	},
	{
		id: "cat_new",
		name: "Nouveautés",
		handle: "nouveautes",
		metadata: { name_en: "New Arrivals" },
		product_category_image: [
			{
				id: "catimg_new",
				url: "/home/arrivals-3.jpg",
				file_id: "arrivals-3.jpg",
				type: "thumbnail",
				category_id: "cat_new",
			},
			{
				id: "catimg_new_mobile",
				url: "/home/cover-phone.jpg",
				file_id: "cover-phone.jpg",
				type: "image",
				category_id: "cat_new",
			},
		],
	},
	{
		id: "cat_sale",
		name: "Soldes",
		handle: "soldes",
		metadata: { name_en: "Sale" },
		product_category_image: [
			{
				id: "catimg_sale",
				url: "/home/arrivals-4.jpg",
				file_id: "arrivals-4.jpg",
				type: "thumbnail",
				category_id: "cat_sale",
			},
			{
				id: "catimg_sale_mobile",
				url: "/home/cover-phone.jpg",
				file_id: "cover-phone.jpg",
				type: "image",
				category_id: "cat_sale",
			},
		],
	},
];

// Synthetic "page" category: the site's nav/home-page building blocks key off
// a parent category with children (Medusa's tree model) — this wrapper lets
// the existing homepage/nav logic keep working unchanged against fake data.
categories.push({
	id: "cat_boutique",
	name: "Boutique",
	handle: "boutique",
	metadata: { name_en: "Shop" },
	category_children: [
		{ ...categories[0]!, metadata: { ...categories[0]!.metadata, third_section: true } },
		{ ...categories[1]! },
		{ ...categories[2]!, metadata: { ...categories[2]!.metadata, sixth_section: true } },
		{ ...categories[3]! },
		{ ...categories[4]!, metadata: { ...categories[4]!.metadata, eight_section: true } },
		{ ...categories[5]! },
	],
});

export const getCategoryByHandle = (handle: string) =>
	categories.find((c) => c.handle === handle);

export const getCategoryById = (id: string) =>
	categories.find((c) => c.id === id);
