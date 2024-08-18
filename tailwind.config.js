/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-blue-1": "#0D192D",
        "dark-blue-2": "#162A4B",
        "dark-blue-3": "#1E3966",
        "dark-blue-4": "#0C1517",
        "dark-blue-5": "#08090A",
        "light-blue-1": "#C6CFE3",
        "gray-1": "#E0E2EC",
        "gray-2": "#D0D2DC",
        "gray-3": "#45484F"
      }
    },
  },
  plugins: [],
}

