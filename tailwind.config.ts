import type { Config } from "tailwindcss";
// @ts-ignore
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
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
				background: 'var(--background)',
				surface: 'var(--surface)',
				'surface-secondary': 'var(--surface-secondary)',
				border: 'var(--border)',
				'accent-primary': 'var(--accent-primary)',
				'accent-secondary': 'var(--accent-secondary)',
				'accent-danger': 'var(--accent-danger)',
				'accent-deep': 'var(--accent-deep)',
				'text-primary': 'var(--text-primary)',
				'text-muted': 'var(--text-muted)',
				'text-inverse': 'var(--text-inverse)',
				sidebar: {
					bg: 'var(--sidebar-bg)',
					active: 'var(--sidebar-active)',
					hover: 'var(--sidebar-hover)',
					text: 'var(--sidebar-text)',
					'text-muted': 'var(--sidebar-text-muted)',
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				primary: {
					DEFAULT: '#FFA103',
					foreground: '#1E1E1E'
				},
				destructive: {
					DEFAULT: '#BC2D29',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F5EACE',
					foreground: '#6B5C4E'
				},
				accent: {
					DEFAULT: '#FFA103',
					foreground: '#1E1E1E'
				}
			},
			borderRadius: {
				lg: '8px',
				md: '4px',
				sm: '2px'
			},
			fontFamily: {
				inter: [
					'Inter',
					'sans-serif'
				]
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
