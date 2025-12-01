/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1440px',
      },
      colors: {
        'azul-claro': '#A7C7E7',
        'azul-bebe': '#89CFF0',
        'rosa-pastel': '#FFC0CB',
      },
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

