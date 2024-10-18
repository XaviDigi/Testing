module.exports = {
	content: [
	  './pages/**/*.{js,ts,jsx,tsx,mdx}',
	  './components/**/*.{js,ts,jsx,tsx,mdx}',
	  './app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
	  extend: {
		colors: {
		  beige: {
			50: '#faf6f1',
			100: '#f0e6d9',
			200: '#e6d7c3',
			300: '#d9c3a3',
			400: '#ccaf83',
			500: '#bf9b63',
			600: '#a67e4b',
			700: '#8c6239',
			800: '#734d2d',
			900: '#593d23',
		  },
		},
	  },
	},
	plugins: [],
  }