/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#C43039',
        'brand-purple': '#731B4F',
        'brand-dark-purple': '#281535',
        'brand-light-purple': '#841E5A',
        'brand-orange': '#F5784B',
        'brand-gray-light': '#EDEDED'
      }
    },
  },
  plugins: [],
}
