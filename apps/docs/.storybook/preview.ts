import "@prettyfull/ui/styles.css";
import type { Preview } from "@storybook/nextjs-vite";
import "../globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
