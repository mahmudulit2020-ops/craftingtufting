/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FBF8F3',
          100: '#F5EFE6',
          200: '#EBE0D0',
          300: '#DCCCB4',
          400: '#C9B291',
          500: '#B89968',
          600: '#A67E4D',
          700: '#8A663E',
          800: '#6B4F31',
          900: '#4D3923',
        },
        charcoal: {
          50: '#F6F6F5',
          100: '#E2E2E0',
          200: '#C4C4C1',
          300: '#9C9C97',
          400: '#6E6E69',
          500: '#4A4A46',
          600: '#33332F',
          700: '#242421',
          800: '#1A1A18',
          900: '#0F0F0E',
        },
        accent: {
          DEFAULT: '#8B6F47',
          light: '#A88963',
          dark: '#6B5236',
        },
        terracotta: {
          DEFAULT: '#B5532A',
          light: '#C97A4F',
          dark: '#8F3D1E',
        },
        cream: '#FAF7F2',
        offwhite: '#FBFAF6',
      },
      fontFamily: {
        display: ['Arial', 'Helvetica', 'sans-serif'],
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        body: ['Arial', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-right': 'slideRight 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
