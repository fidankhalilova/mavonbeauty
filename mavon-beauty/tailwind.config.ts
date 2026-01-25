import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./Components/**/*.{js,ts,jsx,tsx,mdx}",
        "./Layout/**/*.{js,ts,jsx,tsx,mdx}",
        "./Sections/**/*.{js,ts,jsx,tsx,mdx}",
        "./Templates/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
};

export default config;
