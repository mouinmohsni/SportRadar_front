/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#dc5f18', // Votre orange
        'brand-dark': '#0a1128',    // Votre bleu foncé
        'text-main': '#333333',     // Un gris foncé très lisible
        'text-light': '#666666',    // Un gris plus clair mais toujours lisible
      }
    },

  },
  plugins: [],
}
