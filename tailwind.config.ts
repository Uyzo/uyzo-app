import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#3b5bfd", dark: "#2843d6", light: "#eaeeff" },
      },
    },
  },
  plugins: [],
};
export default config;
