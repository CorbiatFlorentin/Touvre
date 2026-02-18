/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      backgroundImage: {
        page: 'radial-gradient(circle at 20% 20%, #1f2937 0%, #0f172a 35%, #050608 100%)',
        hero: "url('/IMG_1806.jpeg')",
        'hero-overlay':
          'linear-gradient(120deg, rgba(2, 6, 23, 0.85) 0%, rgba(15, 23, 42, 0.6) 40%, rgba(2, 6, 23, 0.95) 100%)',
      },
      boxShadow: {
        panel: '0 25px 60px rgba(2, 6, 23, 0.45)',
      },
      keyframes: {
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        reveal: 'reveal 900ms ease both',
      },
    },
  },
  plugins: [],
}
