/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '380px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['"Manrope"', '"General Sans"', '"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Manrope"', '"General Sans"', 'sans-serif'],
        heading: ['"Manrope"', '"General Sans"', '"Inter Tight"', 'Inter', 'sans-serif'],
        editorial: ['"Literata"', 'Charter', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', '"DM Mono"', 'ui-monospace', 'monospace'],
        orbitron: ['"Manrope"', '"General Sans"', '"Inter Tight"', 'Inter', 'sans-serif'],
      },
      colors: {
        deepSpace: '#05070D',
        obsidian: '#090D16',
        cosmicNavy: '#10182A',
        stellarBlue: {
          DEFAULT: '#1A2FFB',
          glow: 'rgba(26, 47, 251, 0.35)',
        },
        nebulaCyan: {
          DEFAULT: '#54C9F5',
          glow: 'rgba(84, 201, 245, 0.35)',
        },
        lunarWhite: '#F0F1FA',
        dustGrey: '#9299A8',
        titanium: '#C4CBD6',
        solarAmber: {
          DEFAULT: '#F5A623',
          glow: 'rgba(245, 166, 35, 0.35)',
        },
        signalGreen: '#69D69A',
        space: {
          950: '#05070D',
          900: '#090D16',
          800: '#10182A',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-drift': 'subtleDrift 16s ease-in-out infinite alternate',
      },
      keyframes: {
        subtleDrift: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.03) translate(-1%, -1%)' },
        },
      },
    },
  },
  plugins: [],
}
