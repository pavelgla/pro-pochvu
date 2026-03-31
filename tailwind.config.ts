import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        brand: {
          green: "#2D5016",
          brown: "#8B4513",
          cream: "#FFF8DC",
          gray: {
            light: "#F0F0F0",
            dark: "#333333",
          },
        },
        ecokon: "#2D5016",
        tsvetologiya: "#4A5568",
        error: "#E63946",
        success: "#06D6A0",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};
export default config;
