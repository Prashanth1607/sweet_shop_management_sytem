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
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6ba77',
          400: '#f19340',
          500: '#ed7419',
          600: '#de5a0f',
          700: '#b8430f',
          800: '#933614',
          900: '#762e13',
        },
        sweet: {
          pink: '#ff69b4',
          purple: '#9370db',
          blue: '#87ceeb',
          green: '#98fb98',
          yellow: '#ffeb3b',
          orange: '#ffa500',
        }
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}