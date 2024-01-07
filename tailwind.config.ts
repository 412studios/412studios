import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'white-rgb': 'rgb(var(--white-rgb))',
        'black-rgb': 'rgb(var(--black-rgb))',
        'foreground-rgb': 'rgb(var(--foreground-rgb))',
        'background-start-rgb': 'rgb(var(--background-start-rgb))',
        'background-end-rgb': 'rgb(var(--background-end-rgb))',
        'highlight-rgb': 'rgb(var(--highlight-rgb))',
      },
    },
  },
  plugins: [],
}
export default config
