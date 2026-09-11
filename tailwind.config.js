/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primario: {
          DEFAULT: '#2A3964',
          50: '#F4F6FA',
          100: '#E9EDF6',
          200: '#D4DAED',
          300: '#B7C2E1',
          400: '#93A3D2',
          500: '#6F85C3',
          600: '#4B66B4',
          700: '#3C5290',
          800: '#304273',
          900: '#2A3964',
          950: '#222845',
        },
        secundario: {
          DEFAULT: '#880000',
          50: '#FFF0F0',
          100: '#FFDBDB',
          200: '#FFBDBD',
          300: '#FF9494',
          400: '#FF5C5C',
          500: '#FF1A1A',
          600: '#D60000',
          700: '#880000',
          800: '#700000',
          900: '#520000',
          950: '#424242',
        },
        'fondo-oscuro': '#0F1524',
      },
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        editorial: ['Charter', 'Bitstream Charter', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
