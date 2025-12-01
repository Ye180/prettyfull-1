// import { CardProduct } from "@prettyfull/ui";
// import type { Meta, StoryObj } from "@storybook/nextjs";

// import { fn } from "storybook/test";

// const meta: Meta<typeof CardProduct> = {
//   title: "Ui/CardProduct",
//   component: CardProduct,

//   // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
//   tags: ["autodocs"],
//   args: {
//     onClick: fn(),
//     variants: [
//       {
//         color: { label: "Rouge", code: "#FF0000" },
//         size: ["S", "M", "L"],
//         images: ["/assets/product_1.jpg", "/assets/product_2.webp"],
//         quantity: 1,
//       },
//     ],
//     smallDescription: "Top polyvalente á Manche",
//     title: "Sweet-Top",
//     price: {
//       amount: 12000,
//       currency: "XAF",
//     },
//   },

//   argTypes: {
//     variant: {
//       options: ["default"],
//     },
//     size: {
//       options: ["default", "sm", "lg"],
//       control: { type: "select" },
//     },
//   },
// };

// export default meta;

// type Story = StoryObj<typeof meta>;

// // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
// export const ProductSimple: Story = {
//   args: {
//     variant: "default",
//     className: "w-[35rem] h-[55rem]",
//   },
// };

// export const SoldeProduct: Story = {
//   args: {
//     onClick: fn(),

//     variants: [
//       {
//         color: { label: "Rouge", code: "#FF0000" },
//         size: ["S", "M", "L"],
//         images: ["/assets/product_1.jpg", "/assets/product_2.webp"],
//         quantity: 1,
//       },
//     ],
//     smallDescription: "Top polyvalente á Manche",
//     className: "w-[35rem] h-[55rem]",
//     title: "Sweet-Top",
//     price: {
//       amount: 12000,
//       currency: "XAF",
//     },
//     promotion: {
//       reduced_price: {
//         amount: 12000,

//         currency: "XAF",
//       },
//       pourcentage: 50,
//     },
//   },
// };

// export const VariableProduct: Story = {
//   args: {
//     onClick: fn(),

//     smallDescription: "Top polyvalente á Manche",
//     title: "Sweet-Top",
//     price: {
//       amount: 12000,

//       currency: "XAF",
//     },
//     className: "w-[35rem] h-[55rem]",
//     variants: [
//       {
//         color: { label: "Rouge", code: "#FF0000" },
//         size: ["S", "M", "L"],
//         images: ["/assets/product_1.jpg", "/assets/product_2.webp"],
//         quantity: 1,
//       },
//       {
//         color: { label: "Vert", code: "#00FF00" },
//         size: ["S", "M", "L"],
//         images: ["/assets/product_2.webp", "image4.jpg"],
//         quantity: 1,
//       },
//     ],
//   },
// };
