import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: "var(--gold)",
          soft: "var(--gold-soft)",
        },
        blue: {
          electric: "var(--blue-electric)",
        },
        success: "var(--success)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      boxShadow: {
        gold: "var(--shadow-gold)",
        blue: "var(--shadow-blue)",
      },
    },
  },
  safelist: [
    { pattern: /bg-(success|danger|gold|blue-electric)/ },
    { pattern: /text-(success|danger|gold|blue-electric)/ },
    { pattern: /border-(success|danger|gold|blue-electric)/ },
  ],
  plugins: [],
};

export default config;
