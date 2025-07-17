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
    },
  },
  plugins: [],
};
