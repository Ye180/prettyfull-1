import { GridCardProduct } from "@prettyfull/ui";
import { Meta, StoryObj } from "@storybook/nextjs";
import { ItemsCardProduct } from "./items";

const meta: Meta<typeof GridCardProduct> = {
	title: "Ui/GridCardProduct",
	component: GridCardProduct,

	tags: ["autodocs"],

	args: {
		title: "Produit Carte",
	},

	argTypes: {
		variant: {
			options: ["default"],
			control: { type: "select" },
		},
	},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ThreeItems: Story = {
	args: {
		variant: "default",
		className: "w-screen",
		children: <ItemsCardProduct />,
		grid_card: "grid-cols-3 gap-8 [&>div]:h-[75rem]",
		action_grid: false,
	},
};

export const FourItems: Story = {
	args: {
		variant: "default",
		children: <ItemsCardProduct />,
		className: "w-screen",
		grid_card: "grid-cols-4 gap-8 [&>div]:h-[60rem]",
		action_grid: false,
	},
};

export const FiveItems: Story = {
	args: {
		variant: "default",
		children: <ItemsCardProduct />,
		className: "w-screen",
		grid_card: "grid-cols-5 gap-8 [&>div]:h-[55rem]",
		action_grid: false,
	},
};
