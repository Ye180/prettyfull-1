import { CardProduct } from "@prettyfull/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

const meta: Meta<typeof CardProduct> = {
  title: "Ui/CardProduct",
  component: CardProduct,

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  args: {
    onClick: fn(),
    children: "Ajouter une image",
    small_description: "Top polyvalente á Manche",
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
export const Product_Simple: Story = {
  args: {
    variant: "default",
  },
};

export const Solde_Product: Story = {
  args: {
    onClick: fn(),
    children: "Ajouter une image",
    small_description: "Top polyvalente á Manche",
    title: "Sweet-Top",
    price: 12000,
    promotion: {
      reduced_price: 6000,
      pourcentage: 50,
    },
  },
};
