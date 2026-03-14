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
        tp: {
          bg: '#0C0B09',
          warm: '#D4CCC0',
          tea: '#B8AFA2',
          ash: '#8A847A',
          mist: '#6A645C',
          stone: '#3A3632',
          cream: '#E8E0D4',
          line: '#4A4440',
        },
      },
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        body: ['Noto Sans JP', 'sans-serif'],
        ui: ['Jost', 'sans-serif'],
        tc: ['Noto Sans TC', 'sans-serif'],
        'tc-serif': ['Noto Serif TC', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
