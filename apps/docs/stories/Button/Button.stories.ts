import { Button } from "@prettyfull/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Button> = {
  title: "Ui/Button",
  component: Button,

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: "color" },
  // },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onClick: fn(),
    children: "Créer un compte",
    shape: "rounded",
    isLoading: false,
  },

  argTypes: {
    variant: {
      options: ["default", "secondary", "outline", "destructive"],
      control: { type: "select" },
    },
    size: {
      options: ["default", "sm", "lg"],
      control: { type: "select" },
    },
    shape: {
      options: ["rounded", "square"],
      control: { type: "radio" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    variant: "default",
  },
};

export const Loading: Story = {
  args: {
    children: "Chargement",
    isLoading: true,
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};
