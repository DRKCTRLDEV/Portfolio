/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        glass: {
          light: "rgba(255, 255, 255, 0.25)",
          dark: "rgba(0, 0, 0, 0.25)",
        },
        glow: {
          light: "rgba(59, 130, 246, 0.5)",
          dark: "rgba(147, 51, 234, 0.5)",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "bounce-gentle": "bounce 2s infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
