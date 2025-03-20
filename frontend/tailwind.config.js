/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'status-red': '#ef4444',
        'status-yellow': '#f59e0b',
        'status-green': '#22c55e',
      },
    },
  },
  plugins: [],
} 