import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Dark premium theme
        bg: {
          base: "#0a0a0b",
          surface: "#111113",
          elevated: "#18181b",
          border: "#27272a",
        },
        text: {
          primary: "#fafafa",
          secondary: "#a1a1aa",
          muted: "#52525b",
        },
        accent: {
          DEFAULT: "#6366f1",
          hover: "#818cf8",
          muted: "#6366f120",
        },
        category: {
          smma: "#22d3ee",
          ecommerce: "#a78bfa",
          autre: "#fb923c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "0.625rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
}

export default config
