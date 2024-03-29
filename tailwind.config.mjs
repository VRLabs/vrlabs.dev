/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				textPrimary: '#FEFEFE',
				textSecondary: '#AFAFB2',
				elements: "#303845",
				elementsBright: "#485666",
				elementsBrighter: "#515F73",
				elementsDark: "#1E232B",
				action: '#2875CC',
				actionBright: '#308BF2',
				actionDark: '#3670B2',
				border: '#4B515E',
				borderBright: '#6C7587',
				danger: '#BF483B',
				dangerBright: '#E65747',
			},
			fontFamily: {
				'Sans': ['Sans'],
				'Sans-Bold': ['Sans-Bold'],
				'Novecento-Utrabold': ['Novecento-Utrabold']
			},
			borderWidth: {
				'1': '1px'
			},
			fontSize: {
				desktopHeading: '5rem',
				mobileHeading: '3.5rem',
				desktopHeading2: '1.8rem',
				mobileHeading2: '1.5rem',
				desktopLarge: '1.25rem',
				mobileLarge: '1.19rem',
				normal: '1rem',
				small: '0.8rem',
				none: '0rem',
			},
			gridTemplateColumns: {
				'packages': 'repeat(auto-fit, minmax(260px, 1fr))',
				'packagesMobile': 'repeat(auto-fit, minmax(230px, 1fr))',
			},
			boxShadow: {
				'packages': '0 0 15px 5px rgb(0 0 0 / 0.15)',
				'packagesHover': '0 0 20px 5px rgb(0 0 0 / 0.15)',
			},
			scale: {
				'102': '1.02',
			},
			screens: {
				'ssm': '500px',
			},
			backgroundImage: {
				shine: 'radial-gradient(600px 100px at 50%0,rgba(178, 212, 255, 0.1) 0%,rgba(19, 30, 49, 0) 100%)'
			}
		},
	},
	plugins: [],
}
