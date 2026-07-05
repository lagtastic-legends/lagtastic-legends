import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                sans: [
                    'Satoshi',
                    'General Sans',
                    'system-ui',
                    '-apple-system',
                    'sans-serif'
                ],
                display: [
                    'Bricolage Grotesque',
                    'system-ui',
                    'sans-serif'
                ],
                mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
            },
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                soft: '0 2px 8px -2px rgba(0,0,0,0.1)',
                glow: '0 0 20px -5px oklch(var(--primary) / 0.3)',
                'emerald-sm': '0 0 12px oklch(0.65 0.2 155 / 0.4)',
                'emerald-md': '0 0 24px oklch(0.65 0.2 155 / 0.3)'
            },
            transitionDuration: {
                fast: 'var(--duration-fast)',
                normal: 'var(--duration-normal)',
                slow: 'var(--duration-slow)',
                slower: 'var(--duration-slower)',
                slowest: 'var(--duration-slowest)'
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'smooth-in': 'cubic-bezier(0.4, 0, 1, 1)',
                'smooth-out': 'cubic-bezier(0, 0, 0.2, 1)',
                'bounce-subtle': 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' }
                },
                'fade-out': {
                    from: { opacity: '1' },
                    to: { opacity: '0' }
                },
                'slide-in-up': {
                    from: { transform: 'translateY(10px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' }
                },
                'slide-in-down': {
                    from: { transform: 'translateY(-10px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' }
                },
                'scale-in': {
                    from: { transform: 'scale(0.95)', opacity: '0' },
                    to: { transform: 'scale(1)', opacity: '1' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'fade-out': 'fade-out 0.2s ease-in',
                'slide-in-up': 'slide-in-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-in-down': 'slide-in-down 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                'scale-in': 'scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
