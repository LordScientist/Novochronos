/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"General Sans"', '"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['"General Sans"', '"Inter Tight"', 'Inter', 'sans-serif'],
        editorial: ['"Literata"', 'Charter', 'Georgia', 'serif'],
        mono: ['"DM Mono"', '"Space Mono"', 'monospace'],
        orbitron: ['"General Sans"', '"Inter Tight"', 'Inter', 'sans-serif'],
      },
      colors: {
        space: {
          950: '#030712',
          900: '#070c1b',
          800: '#0f172a',
        },
        martian: {
          DEFAULT: '#e05a36',
          glow: '#ff7a50',
          dark: '#581c10',
        },
        lunar: {
          DEFAULT: '#cbd5e1',
          silver: '#e2e8f0',
          glow: '#93c5fd',
        },
        cosmic: {
          cyan: '#38bdf8',
          purple: '#a855f7',
          gold: '#fbbf24',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
