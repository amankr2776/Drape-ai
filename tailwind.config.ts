import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
        '96': '96px',
        '128': '128px',
      },
      fontFamily: {
        body: ["DM Sans", "sans-serif"],
        headline: ["Cormorant Garamond", "serif"],
      },
      colors: {
        obsidian: {
          DEFAULT: "#0A0A0F",
          2: "#111118",
          3: "#1A1A24",
          4: "#222230",
        },
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C97A",
          dim: "#8B6E2E",
        },
        rose: {
          DEFAULT: "#C4545A",
          dim: "#7A3338",
        },
        ivory: {
          DEFAULT: "#F5F0E8",
          2: "#C8C0B0",
          3: "#7A7268",
          4: "#3A3530",
        },
        border: "rgba(201,168,76,0.12)",
        success: "#4CAF7A",
        error: "#E85555",
        warning: "#E8A04C",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "16px",
        button: "8px",
        input: "8px",
        pill: "100px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      boxShadow: {
        small: "0 2px 8px rgba(0,0,0,0.4)",
        medium: "0 8px 32px rgba(0,0,0,0.5)",
        large: "0 24px 64px rgba(0,0,0,0.6)",
        gold: "0 0 24px rgba(201,168,76,0.15)",
      },
    },
  },
  plugins: [animate],
};

export default config;
