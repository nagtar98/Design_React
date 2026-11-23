/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        'brutal-sm': '2px 2px 0px #000000',
        'brutal': '4px 4px 0px #000000',
        'brutal-lg': '6px 6px 0px #000000',
        'brutal-xl': '8px 8px 0px #000000',
        'brutal-press': '1px 1px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        brutal: {
          bg: '#fbf9f4',
          yellow: '#fde047',
          amber: '#fbbf24',
          blue: '#93c5fd',
          sky: '#38bdf8',
          green: '#86efac',
          emerald: '#34d399',
          red: '#fca5a5',
          rose: '#fb7185',
          purple: '#d8b4fe',
          dark: '#121212',
        },
      },
    },
  },
  plugins: [],
};
