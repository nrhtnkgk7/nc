import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        nc: {
          black: '#0A0A0A',
          charcoal: '#1A1A1E',
          graphite: '#2A2A2E',
          slate: '#444448',
          silver: '#8A8A90',
          pearl: '#C8C8CC',
          white: '#F0EDE8',
          gold: '#B8956A',
          'gold-light': '#D4B896',
          'gold-dark': '#8A6E4A',
          'tw-gold': '#C9A96E',
        },
      },
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        body: ['Noto Sans JP', 'sans-serif'],
        ui: ['Jost', 'sans-serif'],
        tc: ['Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
