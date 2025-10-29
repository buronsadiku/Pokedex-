/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'shadow-red-500/50',
    'shadow-blue-500/50',
    'shadow-green-500/50',
    'shadow-yellow-500/50',
    'shadow-purple-500/50',
    'shadow-cyan-500/50',
    'shadow-gray-500/50',
    'shadow-indigo-500/50',
    'shadow-lime-500/50',
    'shadow-pink-500/50',
  ],
}
