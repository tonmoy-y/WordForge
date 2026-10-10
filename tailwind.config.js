/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'word-blue': '#185ABD',
        'word-blue-dark': '#103F91',
        'word-blue-light': '#EBF3FC',
        'word-blue-hover': '#124AA0',
      },
    },
  },
  plugins: [],
};
