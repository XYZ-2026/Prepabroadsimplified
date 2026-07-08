import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        iqred: '#9C1010',
        red: {
          500: '#ef4444',
          600: '#dc2626',
        }
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
export default config;
