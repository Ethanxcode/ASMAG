/* eslint-disable prettier/prettier */
import type { Config } from 'tailwindcss';

export default {
  prefix: 'tw-',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    colors: {
      primary: '#274C5B',
      secondary: '#7EB693',
      accent: '#EFD372',
      danger: '#f42f25',
      'tiki-red': '#fe3e3a',
      'tiki-blue-href': '#0B74E5',
      background: {
        100: '#F9F8F8',
        200: '#EFF6F1',
        300: '#D4D4D4',
        400: '#525C60'
      },
      border: {
        surface: '#dfe7ef'
      }
    },
    fontFamily: {
      yellowtail: ['Yellowtail', 'cursive']
    },
    extend: {}
  },
  plugins: []
} satisfies Config;

