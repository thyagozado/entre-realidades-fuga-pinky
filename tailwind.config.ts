import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom arcade colors
				arcade: {
					blue: '#00FFFF',
					magenta: '#FF00FF',
					green: '#00FF00',
					black: '#000000',
					white: '#FFFFFF'
				}
			},
			fontFamily: {
				'pixel': ['"Press Start 2P"', 'cursive'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-neon': {
					'0%, 100%': { 
						boxShadow: '0 0 5px #FF00FF, 0 0 10px #FF00FF, 0 0 15px #FF00FF',
					},
					'50%': { 
						boxShadow: '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF',
					}
				},
				'blink': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'glitch': {
					'0%, 100%': { transform: 'translate(0)' },
					'20%': { transform: 'translate(-5px, 5px)' },
					'40%': { transform: 'translate(-5px, -5px)' },
					'60%': { transform: 'translate(5px, 5px)' },
					'80%': { transform: 'translate(5px, -5px)' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'grid-scroll-x': {
					'0%': { backgroundPositionX: '0' },
					'100%': { backgroundPositionX: '40px' }
				},
				'grid-scroll-y': {
					'0%': { backgroundPositionY: '0' },
					'100%': { backgroundPositionY: '40px' }
				},
				'chomp': {
					'0%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
					'25%': { clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 15% 100%)' },
					'50%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' },
					'75%': { clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 15% 100%)' },
					'100%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 2s ease-in-out infinite',
				'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
				'blink': 'blink 3s ease-in-out infinite',
				'glitch': 'glitch 0.8s ease-in-out',
				'fade-out': 'fade-out 0.5s ease-in-out forwards',
				'fade-in': 'fade-in 0.5s ease-in-out forwards',
				'grid-scroll-x': 'grid-scroll-x 20s linear infinite',
				'grid-scroll-y': 'grid-scroll-y 20s linear infinite',
				'chomp': 'chomp 0.5s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
