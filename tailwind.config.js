/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        primary: '#00D5B0',
        secondary: '#0A192F',
        accent: '#00D5B0',
        dark: {
          100: '#1E293B',
          200: '#0F172A',
          300: '#0A192F',
        }
      },
      animation: {
        'float': 'float 6s cubic-bezier(0.37, 0, 0.63, 1) infinite',
        'float-delay': 'float 6s cubic-bezier(0.37, 0, 0.63, 1) 1.5s infinite',
        'float-reverse': 'floatReverse 6.5s cubic-bezier(0.37, 0, 0.63, 1) infinite',
        'ripple': 'ripple 1s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px) translateX(0px)' },
          '20%': { transform: 'translateY(-30px) translateX(25px)' },
          '40%': { transform: 'translateY(-10px) translateX(-35px)' },
          '60%': { transform: 'translateY(-40px) translateX(15px)' },
          '80%': { transform: 'translateY(-20px) translateX(-20px)' },
          '100%': { transform: 'translateY(0px) translateX(0px)' },
        },
        floatReverse: {
          '0%': { transform: 'translateY(0px) translateX(0px)' },
          '20%': { transform: 'translateY(-35px) translateX(-40px)' },
          '40%': { transform: 'translateY(-5px) translateX(30px)' },
          '60%': { transform: 'translateY(-40px) translateX(-20px)' },
          '80%': { transform: 'translateY(-15px) translateX(25px)' },
          '100%': { transform: 'translateY(0px) translateX(0px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 