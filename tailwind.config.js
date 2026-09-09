/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-base)',
        foreground: 'var(--text-primary)',
        card: 'var(--bg-surface)',
        'card-foreground': 'var(--text-primary)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-text)',
        },
        border: 'var(--border-color)',
      }
    },
  },
  plugins: [],
}
