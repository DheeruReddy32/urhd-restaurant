/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: {
            DEFAULT: '#E86328',
            light: '#FF7D45',
            dark: '#CA4F18',
            hover: '#D8571F',
          },
          beige: {
            DEFAULT: '#F5EBE1',
            light: '#FAF4ED',
            dark: '#E2D2C2',
          },
          offwhite: '#FAF7F2',
          charcoal: {
            DEFAULT: '#181512',
            light: '#282420',
            border: '#3A3530',
          },
          grey: {
            light: '#ECE9E3',
            DEFAULT: '#7C766F',
            dark: '#48433E',
          },
          gold: '#D4AF37',
          ruby: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        anime: ['var(--font-pirata)', 'serif'],
      },
      boxShadow: {
        'rustic': '0 4px 20px -2px rgba(24, 21, 18, 0.08), 0 2px 6px -1px rgba(24, 21, 18, 0.04)',
        'rustic-lg': '0 12px 30px -4px rgba(24, 21, 18, 0.12), 0 4px 12px -2px rgba(24, 21, 18, 0.06)',
        'orange-glow': '0 0 25px rgba(232, 99, 40, 0.25)',
      },
    },
  },
  plugins: [],
};
