import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent)',
        white: 'white',
        success: 'var(--success)',
        info: 'var(--info)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        gray950: 'var(--gray-950)',
        gray900: 'var(--gray-900)',
        gray800: 'var(--gray-800)',
        gray700: 'var(--gray-700)',
        gray600: 'var(--gray-600)',
        gray500: 'var(--gray-500)',
        gray400: 'var(--gray-400)',
        gray300: 'var(--gray-300)',
        gray200: 'var(--gray-200)',
        gray100: 'var(--gray-100)',
        gray50: 'var(--gray-50)',
        surface: 'var(--surface)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        foregroundLight: 'var(--foreground-light)'
      },
      fontFamily: {
        jetbrains: 'var(--jetbrains-mono)',
        roboto: 'var(--roboto-condensed)'
      },
      keyframes: {
        enterBackgroundModal: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        leaveBackgroundModal: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        enterModal: {
          '0%': { opacity: '0', bottom: '-100px' },
          '100%': { opacity: '1', bottom: '0' },
        },
        leaveModal: {
          '0%': { opacity: '1', bottom: '0' },
          '100%': { opacity: '0', bottom: '100px' },
        },
        enterModalPage: {
          '0%': { opacity: '0', right: '-10%' },
          '100%': { opacity: '1', right: '0' },
        },
        leaveModalPage: {
          '0%': { opacity: '1', right: '0' },
          '100%': { opacity: '0', right: '-10%' },
        }
      },
      animation: {
        enterBackgroundModal: 'enterBackgroundModal 0.3s ease-in-out 1',
        leaveBackgroundModal: 'leaveBackgroundModal 0.3s ease-in-out 1',
        enterModal: 'enterModal 0.3s cubic-bezier(0.77, 0, 0.175, 1) 1',
        leaveModal: 'leaveModal 0.3s cubic-bezier(0.77, 0, 0.175, 1) 1',
        enterModalPage: 'enterModalPage 0.3s cubic-bezier(0.77, 0, 0.175, 1) 1',
        leaveModalPage: 'leaveModalPage 0.3s cubic-bezier(0.77, 0, 0.175, 1) 1',
      }
    }
  }
}
export default config
