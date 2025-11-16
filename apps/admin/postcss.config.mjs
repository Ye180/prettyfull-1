/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: {
		"@tailwindcss/postcss": {},
	},
	content: [
		"./index.html", // si tu as un index.html à la racine
		"./src/**/*.{js,ts,jsx,tsx}", // tous tes fichiers React/Vue/Svelte/etc.
		"./src/**/**/*.{js,ts,jsx,tsx}", // tous tes fichiers React/Vue/Svelte/etc.
	],
};

export default config;
