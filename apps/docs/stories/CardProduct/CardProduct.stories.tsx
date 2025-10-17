import { CardProduct } from "@prettyfull/ui";
import type { Meta, StoryObj } from "@storybook/nextjs";

import { fn } from "storybook/test";

const meta: Meta<typeof CardProduct> = {
	title: "Ui/CardProduct",
	component: CardProduct,

	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	args: {
		onClick: fn(),
		notVariable: {
			color: { label: "Rouge", code: "#FF0000" },
			size: ["S", "M", "L"],
			image: "/assets/product_2.webp",
			quantity: 1,
		},
		smallDescription: "Top polyvalente á Manche",
		title: "Sweet-Top",
		price: 12000,
	},

	argTypes: {
		variant: {
			options: ["default"],
		},
		size: {
			options: ["default", "sm", "lg"],
			control: { type: "select" },
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ProductSimple: Story = {
	args: {
		variant: "default",
		className: "w-[35rem] h-[55rem]",
	},
};

export const SoldeProduct: Story = {
	args: {
		onClick: fn(),

		notVariable: {
			color: { label: "Rouge", code: "#FF0000" },
			size: ["S", "M", "L"],
			image: "/assets/product_1.jpg",
			quantity: 1,
		},
		smallDescription: "Top polyvalente á Manche",
		className: "w-[35rem] h-[55rem]",
		title: "Sweet-Top",
		price: 12000,
		promotion: {
			reduced_price: 6000,
			pourcentage: 50,
		},
	},
};

export const VariableProduct: Story = {
	args: {
		onClick: fn(),

		smallDescription: "Top polyvalente á Manche",
		title: "Sweet-Top",
		price: 12000,
		className: "w-[35rem] h-[55rem]",
		variable: [
			{
				color: { label: "Rouge", code: "#FF0000" },
				size: ["S", "M", "L"],
				image: ["/assets/product_1.jpg", "/assets/product_2.webp"],
				quantity: 1,
			},
			{
				color: { label: "Vert", code: "#00FF00" },
				size: ["S", "M", "L"],
				image: ["/assets/product_2.webp", "image4.jpg"],
				quantity: 1,
			},
		],
	},
};
