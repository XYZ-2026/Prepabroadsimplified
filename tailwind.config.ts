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
        },
        // DESIGN.md Redesign Color Tokens
        'clarvo-blue': 'var(--clarvo-blue, #1258DE)',
        midnight: 'var(--midnight, #171822)',
        paper: 'var(--paper, #F5F7FB)',
        sky: 'var(--sky, #E6EDFF)',
        ink: 'var(--ink, #12131C)',
        muted: 'var(--muted, #5B6275)',
        line: 'var(--line, #DDE3F0)',
      },
      fontFamily: {
        dmsans: ['var(--font-dm-sans)', 'sans-serif'],
        anton: ['var(--font-anton)', 'Impact', 'sans-serif'],
      },
      borderRadius: {
        panel: '28px',
        card: '14px',
        photo: '20px',
        pill: '9999px',
      },
      boxShadow: {
        'clarvo-elevated': '0 24px 60px -24px rgba(18, 88, 222, 0.25)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
export default config;
