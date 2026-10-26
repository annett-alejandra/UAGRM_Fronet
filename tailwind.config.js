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
        // Paleta Oficial Institucional UAGRM (2. Tonos y Variaciones)
        uagrm: {
          blue: {
            DEFAULT: '#191A7D',
            medio: '#2B6CB0',
            suave: '#556DEF',
            'suave-alt': '#85BDEF',
            'muy-suave': '#DAEFFE',
          },
          red: {
            DEFAULT: '#D31338',
            melocoton: '#F08C6E',
            salmon: '#F39E8E',
            rosado: '#FCECEF',
            'rosado-alt': '#EFFAFE',
          },
          gray: {
            profundo: '#191A2D',
            DEFAULT: '#6B7280',
            suave: '#E2E8F0',
            'blanco-hueso': '#F9F9F6',
            blanco: '#FFFFFF',
          },
        },
        primario: {
          DEFAULT: '#191A7D',
          50: '#DAEFFE',
          100: '#C7E5FE',
          200: '#9AC9FD',
          300: '#6FA8FA',
          400: '#556DEF',
          500: '#3D55D8',
          600: '#2B6CB0',
          700: '#1F3F96',
          800: '#19288A',
          900: '#191A7D',
          950: '#0F104D',
        },
        secundario: {
          DEFAULT: '#D31338',
          50: '#FCECEF',
          100: '#F9D5DB',
          200: '#F39E8E',
          300: '#F08C6E',
          400: '#E84A6A',
          500: '#D31338',
          600: '#B70F2F',
          700: '#8E0B24',
          800: '#6A081B',
          900: '#480512',
          950: '#2F020A',
        },
        'fondo-oscuro': '#191A2D',
      },
      fontFamily: {
        jost: ['Jost', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        editorial: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
