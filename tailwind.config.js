/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette énergétique
        energy: {
          low: '#10B981',      // Vert - Faible consommation
          medium: '#F59E0B',   // Orange - Consommation moyenne
          high: '#EF4444',     // Rouge - Haute consommation
          critical: '#a40c0cff', // Rouge foncé - Critique
        },
        // Sources d'énergie
        source: {
          electricity: '#3B82F6', // Bleu
          gas: '#f5970bff',         // Orange
          solar: '#FBBF24',       // Jaune
          wind: '#06B6D4',        // Cyan
          fuel: '#6B7280',        // Gris
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Active le mode sombre avec classe
}