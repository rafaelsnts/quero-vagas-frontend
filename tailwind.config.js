/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-purple": "#5D3FD3",
        "brand-blue": "#2A2F8C",
        "brand-orange": "#FF4500",
        "brand-yellow": "#FFD700",
      },

      animation: {
        glow: "glow 2.5s ease-in-out infinite",
      },

      keyframes: {
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 8px 2px rgba(93, 63, 211, 0.7)",
          },
          "50%": {
            boxShadow: "0 0 14px 2px rgba(93, 63, 211, 0.7)",
          },
        },
      },
    },
  },
  plugins: [],
};
