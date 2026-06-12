import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* shadcn semantic colors — Tailwind v3 format */
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        input: "hsl(var(--input))",
        ring:  "hsl(var(--ring))",
        /* SDA brand tokens — direct hex via CSS variable */
        ink:     "var(--ink)",
        paper:   "var(--paper)",
        accent:  "var(--accent)",
        muted:   "var(--muted)",
        border:  "var(--border)",
        surface: "var(--surface)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger:  "var(--danger)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sora:  ["var(--sr)", "system-ui", "sans-serif"],
        inter: ["var(--in)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
