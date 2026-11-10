/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bflow: {
          navy: '#0F214A',
          tech: '#00A6D4',
          green: '#22C55E',
          neutral: '#F1F5F9',
          dark: '#1F2937'
        },
        claro: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6464',
          500: '#f20000',
          600: '#da291c',
          700: '#c40000',
          800: '#981b13',
          900: '#7e1c15',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
