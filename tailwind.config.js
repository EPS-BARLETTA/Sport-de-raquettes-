/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        boys: {
          50: '#eff6ff',
          100: '#dbeafe',
        },
        girls: {
          50: '#fce7f3',
          100: '#fbcfe8',
        },
      },
    },
  },
  plugins: [],
}