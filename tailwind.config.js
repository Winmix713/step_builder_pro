/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // blue-600
        'primary-50': '#EFF6FF', // blue-50
        'primary-100': '#DBEAFE', // blue-100
        'primary-200': '#BFDBFE', // blue-200
        'primary-500': '#3B82F6', // blue-500
        'primary-600': '#2563EB', // blue-600
        'primary-700': '#1D4ED8', // blue-700
        'primary-800': '#1E40AF', // blue-800
        'primary-900': '#1E3A8A', // blue-900
        'primary-foreground': '#FFFFFF', // white

        // Secondary Colors
        'secondary': '#64748B', // slate-500
        'secondary-50': '#F8FAFC', // slate-50
        'secondary-100': '#F1F5F9', // slate-100
        'secondary-200': '#E2E8F0', // slate-200
        'secondary-300': '#CBD5E1', // slate-300
        'secondary-400': '#94A3B8', // slate-400
        'secondary-500': '#64748B', // slate-500
        'secondary-600': '#475569', // slate-600
        'secondary-700': '#334155', // slate-700
        'secondary-800': '#1E293B', // slate-800
        'secondary-900': '#0F172A', // slate-900
        'secondary-foreground': '#FFFFFF', // white

        // Accent Colors
        'accent': '#0EA5E9', // sky-500
        'accent-50': '#F0F9FF', // sky-50
        'accent-100': '#E0F2FE', // sky-100
        'accent-200': '#BAE6FD', // sky-200
        'accent-500': '#0EA5E9', // sky-500
        'accent-600': '#0284C7', // sky-600
        'accent-700': '#0369A1', // sky-700
        'accent-foreground': '#FFFFFF', // white

        // Background Colors
        'background': '#FAFBFC', // custom off-white
        'surface': '#FFFFFF', // white
        'surface-50': '#F8FAFC', // slate-50
        'surface-100': '#F1F5F9', // slate-100

        // Text Colors
        'text-primary': '#1E293B', // slate-800
        'text-secondary': '#64748B', // slate-500
        'text-muted': '#94A3B8', // slate-400
        'text-inverse': '#FFFFFF', // white

        // Status Colors
        'success': '#059669', // emerald-600
        'success-50': '#ECFDF5', // emerald-50
        'success-100': '#D1FAE5', // emerald-100
        'success-500': '#10B981', // emerald-500
        'success-600': '#059669', // emerald-600
        'success-700': '#047857', // emerald-700
        'success-foreground': '#FFFFFF', // white

        'warning': '#D97706', // amber-600
        'warning-50': '#FFFBEB', // amber-50
        'warning-100': '#FEF3C7', // amber-100
        'warning-500': '#F59E0B', // amber-500
        'warning-600': '#D97706', // amber-600
        'warning-700': '#B45309', // amber-700
        'warning-foreground': '#FFFFFF', // white

        'error': '#DC2626', // red-600
        'error-50': '#FEF2F2', // red-50
        'error-100': '#FEE2E2', // red-100
        'error-500': '#EF4444', // red-500
        'error-600': '#DC2626', // red-600
        'error-700': '#B91C1C', // red-700
        'error-foreground': '#FFFFFF', // white

        // Border Colors
        'border': '#E2E8F0', // slate-200
        'border-light': '#F1F5F9', // slate-100
        'border-muted': '#CBD5E1', // slate-300
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'caption': ['Inter', 'system-ui', 'sans-serif'],
        'data': ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'elevation-1': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'elevation-2': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'elevation-3': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'progress-ring': 'progressRing 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        progressRing: {
          '0%': { strokeDasharray: '0 100' },
          '100%': { strokeDasharray: '100 100' },
        },
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}