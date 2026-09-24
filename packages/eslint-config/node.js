import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { config as baseConfig } from "./base.js";

/**
 * Shared ESLint configuration for Node.js services (Hono backend).
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nodeConfig = [
	...baseConfig,
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
			],
			"no-console": "off",
		},
	},
];
