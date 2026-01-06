/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {

      maxHeight: {
        '500': '500px',
        'screen-menu': '999px', // if many items
      }
    }
  },
  safelist: [
    "bg-violet-600",
    "hover:bg-violet-700",
    "disabled:bg-violet-400",
    "bg-primary",
    "hover:bg-primary/90",
    "disabled:bg-primary/50",
  ],
  plugins: [],
};
