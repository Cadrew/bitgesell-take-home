/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4f9cff",
          DEFAULT: "#227ceb",
          dark: "#1a5bb8",
        },
        secondary: "#ff7f50",
        accent: "#ffd166",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
        button: "0 2px 8px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        xl: "1rem",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
