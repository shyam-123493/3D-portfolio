import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * Portfolio design tokens.
         * Colors that need /opacity modifier support use the
         *   rgb(var(--tw-...) / <alpha-value>)  pattern (Tailwind 3.3+ feature).
         * Colors that never need opacity modifiers use plain var().
         */
        'bg-primary':    'rgb(var(--tw-bg-primary)   / <alpha-value>)',
        'bg-secondary':  'rgb(var(--tw-bg-secondary) / <alpha-value>)',
        'bg-surface':    'rgb(var(--tw-bg-surface)   / <alpha-value>)',
        'border-subtle': 'rgb(var(--tw-border)       / <alpha-value>)',
        'text-primary':  'rgb(var(--tw-text)         / <alpha-value>)',
        'text-secondary':'rgb(var(--tw-text-sec)     / <alpha-value>)',
        'text-muted':    'rgb(var(--tw-text-muted)   / <alpha-value>)',
        'accent-teal':   'rgb(var(--tw-teal)         / <alpha-value>)',
        'accent-violet': 'rgb(var(--tw-violet)       / <alpha-value>)',
        'accent-cyan':   '#00D4FF',
        'accent-blue':   '#0EA5E9',
        'accent-amber':  '#F59E0B',
        'accent-gold':   '#D97706',
        'accent-emerald':'#10B981',
        /* shadcn CSS-variable tokens */
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card:       { DEFAULT: 'var(--card)',    foreground: 'var(--card-foreground)' },
        popover:    { DEFAULT: 'var(--popover)', foreground: 'var(--popover-foreground)' },
        primary:    { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        secondary:  { DEFAULT: 'var(--secondary)', foreground: 'var(--secondary-foreground)' },
        muted:      { DEFAULT: 'var(--muted)',   foreground: 'var(--muted-foreground)' },
        accent:     { DEFAULT: 'var(--accent)',  foreground: 'var(--accent-foreground)' },
        destructive:{ DEFAULT: 'var(--destructive)' },
        border: 'var(--border)',
        input:  'var(--input)',
        ring:   'var(--ring)',
      },
      fontFamily: {
        sans:    ['Figtree', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Figtree', 'Inter', 'sans-serif'],
        serif:   ['Instrument Serif', 'Georgia', 'serif'],
        mono:    ['IBM Plex Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
        script:  ['Alex Brush', 'cursive'],
      },
      fontSize: {
        'display-2xl': ['4.5rem',   { lineHeight: '1.1',  letterSpacing: '-0.03em' }],
        'display-xl':  ['3.75rem',  { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-lg':  ['3rem',     { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md':  ['2.25rem',  { lineHeight: '1.2',  letterSpacing: '-0.015em' }],
        'display-sm':  ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-up':    'fadeUp 0.8s ease-out forwards',
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift':      'drift 8s ease-in-out infinite',
        'scan':       'scan 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
      },
      boxShadow: {
        'glow-teal':  '0 0 32px rgba(111, 227, 210, 0.22)',
        'glow-cyan':  '0 0 24px rgba(0, 212, 255, 0.2)',
        'glow-blue':  '0 0 24px rgba(14, 165, 233, 0.2)',
        'glow-amber': '0 0 24px rgba(245, 158, 11, 0.2)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
} satisfies Config
