@type {import('tailwindcss').Config}
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        /* ✅ Test token (for verification) */
        testred: "#ff0000",

        /* ✅ Semantic design tokens */
        background: "#ffffff",

        primary: {
          DEFAULT: "#1f4f4a",
          foreground: "#ffffff",
        },

        secondary: {
          DEFAULT: "#8c5e3c",
          foreground: "#ffffff",
        },

        accent: {
          DEFAULT: "#d6e5e3",
          foreground: "#1f4f4a",
        },

        surface: "#f7f7f6",
        muted: "#6b7280",
        border: "#e5e7eb",
        danger: "#b91c1c",
      },

      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: ["Merriweather", "Georgia", "Times New Roman", "serif"],
      },
    },
  },

  plugins: [],
};
``;
