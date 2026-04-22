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
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        bg: {
          DEFAULT: "#fbf9f5",
          soft: "#f0ebe1",
          dark: "#1c2018",
        },
        ink: {
          DEFAULT: "#1c1915",
          2: "#544d42",
        },
        mute: "#8a8275",
        line: "#e6e0d4",
        accent: {
          DEFAULT: "#5a6b3a",
          deep: "#3d4a24",
          light: "#8aa55c",
        },
        cream: "#f5efe0",
        // Keep old colors for components not yet migrated
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
