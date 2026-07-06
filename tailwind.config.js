/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pick: {
          deep: '#063B78',
          blue: '#006CB5',
          cyan: '#00BFEA',
          oil: '#1D6F86',
          gold: '#F2C94C',
          dark: '#061827',
        },
      },
    },
  },
  plugins: [],
}
