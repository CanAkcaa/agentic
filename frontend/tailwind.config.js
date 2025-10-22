/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false,
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      primary: {
        100: '#000',
        90: '#FFB720',
        80: '#FFCF52',
        70: '#DDDDDD',
        60: "#71AC4D",
        50: "#D84444",
        40: '#1E1E1E',
        30: '#D1D1D1',
        20: '#FFF',
        10: "#3D3D3D"
      },
      secondary: {
        100: '#F6F6F6',
        90: '#F14A4A',
        80: '#454545',
        70: '#B0B0B0'
      }
    }
  },
  plugins: [],
}