import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // escanea todo lo de src
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
export default config;
