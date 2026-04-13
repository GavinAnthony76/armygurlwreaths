import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Lato"', 'system-ui', 'sans-serif'],
        accent: ['"Dancing Script"', 'cursive'],
        sans: ['"Lato"', 'system-ui', 'sans-serif'],
      },
      colors: {
        olive: {
          50: '#f7f6f0', 100: '#eceadc', 200: '#d6d2b8', 300: '#bcb68e',
          400: '#a49a6a', 500: '#8b7f50', 600: '#726640', 700: '#5a4f31',
          800: '#443c26', 900: '#2d281a', 950: '#181508',
        },
        crimson: {
          50: '#fdf2f3', 100: '#fbe8e8', 200: '#f5c8c9', 300: '#ed9b9d',
          400: '#e36265', 500: '#c8373a', 600: '#a82d2f', 700: '#8a2426',
          800: '#6f1f21', 900: '#5a1c1e', 950: '#310c0e',
        },
        cream: {
          50: '#fdfcf7', 100: '#faf6ec', 200: '#f3ecda', 300: '#e8dcc2',
          400: '#d9c9a3', 500: '#c8b37e', 600: '#af9560', 700: '#8f7848',
          800: '#6e5d39', 900: '#4d4229',
        },
        gold: {
          300: '#e8c97a', 400: '#d4a847', 500: '#b8891e', 600: '#9a6f10',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, rgba(39,36,32,0.75) 0%, rgba(39,36,32,0.3) 60%, transparent 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 40%, rgba(39,36,32,0.85) 100%)',
        'olive-gradient': 'linear-gradient(135deg, #8b7f50 0%, #5a4f31 100%)',
        'patriotic-gradient': 'linear-gradient(135deg, #c8373a 0%, #3d5a7a 100%)',
      },
      boxShadow: {
        'card': '0 2px 16px -4px rgba(39, 36, 32, 0.12)',
        'card-hover': '0 8px 32px -8px rgba(39, 36, 32, 0.22)',
        'modal': '0 24px 64px -16px rgba(39, 36, 32, 0.32)',
        'glow-olive': '0 0 20px rgba(139, 127, 80, 0.3)',
        'glow-gold': '0 0 20px rgba(184, 137, 30, 0.4)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.55s cubic-bezier(0.4,0,0.2,1) forwards',
        shimmer: 'shimmer 1.8s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
