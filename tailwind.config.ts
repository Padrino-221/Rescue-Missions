import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0e3b2b',
          50: '#15523b',
          100: '#1c6649',
          200: '#0a2c1f',
        },
        lime: {
          DEFAULT: '#7ed957',
          50: '#f1fbea',
          100: '#e2f7d4',
          200: '#c5eeac',
          300: '#a7e584',
          400: '#8edf68',
          500: '#7ed957',
          600: '#63b93f',
          700: '#4f9434',
          800: '#3d7128',
          900: '#2a4e1b',
        },
        coral: {
          DEFAULT: '#4caf73',
          50: '#e9f7ef',
          100: '#d3eee0',
          200: '#a8dcc1',
          300: '#81cb9f',
          400: '#5fbd85',
          500: '#4caf73',
          600: '#3d915e',
          700: '#32744c',
        },
        sky: {
          DEFAULT: '#8fd3a1',
          50: '#ecfaf0',
          100: '#d6f4df',
          200: '#b2e8c3',
          300: '#93dea8',
          400: '#8fd3a1',
          500: '#6dc089',
          600: '#55a470',
          700: '#44855b',
        },
        mint: {
          DEFAULT: '#bfe9c7',
          50: '#f3fbf4',
          100: '#e6f7ea',
          200: '#cef0d6',
          300: '#bfe9c7',
          400: '#a3dcaf',
          500: '#83c993',
          600: '#6ab378',
          700: '#569060',
        },
        cream: {
          DEFAULT: '#f8fbf6',
          50: '#fdfefc',
          100: '#f8fbf6',
          200: '#eef4eb',
        },
      },
      fontFamily: {
        serif: ['"Baloo 2"', '"DM Sans"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
