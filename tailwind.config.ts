import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-sage": {
          50: "#f5f7f4",
          100: "#e8f0e6",
          200: "#d8e8d0",
          300: "#c5dbb8",
          400: "#a8c99a",
          500: "#8fb582",
          600: "#6ba382",
          700: "#548068",
          800: "#3f5d4d",
          900: "#2d4437",
          DEFAULT: "#6ba382",
          foreground: "#1a1d1b",
        },
        "brand-dark": {
          50: "#f5f6f5",
          100: "#e4e6e2",
          200: "#c9cec7",
          300: "#acb5a9",
          400: "#8f9a8b",
          500: "#747f7b",
          600: "#5d6a66",
          700: "#465450",
          800: "#35403b",
          900: "#252b28",
          DEFAULT: "#1a1d1b",
        },
        "brand-warm": {
          50: "#fdf7f4",
          100: "#f9e8e3",
          200: "#f2d4c5",
          300: "#e8b89f",
          400: "#e0997d",
          500: "#d97a5e",
          600: "#c84641",
          700: "#a8372f",
          800: "#8d2d27",
          900: "#6e231f",
          DEFAULT: "#c84641",
        },
      },
      fontFamily: {
        sans: ["Garet", ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        zen: "1rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(26, 29, 27, 0.06)",
        subtle: "0 1px 3px rgba(26, 29, 27, 0.04)",
      },
      keyframes: {
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
