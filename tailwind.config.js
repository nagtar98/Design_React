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
        raw: {
          yellow: '#FFE600',   // Cyber / Hazard Yellow
          orange: '#FF7A00',   // Safety Orange
          red: '#FF2A2A',      // Vivid Crimson
          blue: '#0052FF',     // Electric Cobalt Blue
          cyan: '#00D2FF',     // Electric Cyan
          green: '#00D26A',    // Electric Signal Green
          canvas: '#F4F4F0',   // Industrial Paper Canvas
          surface: '#FFFFFF',  // Pure Stark White
          dark: '#111111',     // Pitch Black
        },
      },
    },
  },
  plugins: [],
};
