/** @type {import('tailwindcss').Config} */
// 颜色与 src/index.css 中的 :root 设计变量保持一致（纸、墨，以及取自笔名的蒜苗绿、虎斑橙、紫皮色）。
// gray 被替换为同等明度的暖灰，算法小屋里大量既有的 gray 工具类会因此自动融入同一套纸色。
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3D6A47',
        secondary: '#7A4E6E',
        accent: '#B4621A',
        dark: '#2B2620',
        light: '#F6F1E7',
        ink: { DEFAULT: '#2B2620', 2: '#4D463D', 3: '#6F665A' },
        paper: { DEFAULT: '#F6F1E7', deep: '#EEE7DA' },
        surface: '#FFFDF8',
        sprout: { DEFAULT: '#3D6A47', deep: '#2F5438', soft: '#E4EBDD' },
        tiger: { DEFAULT: '#B4621A', ink: '#94500F', soft: '#F6E6D2' },
        plum: { DEFAULT: '#7A4E6E', soft: '#F1E5EC' },
        inkblue: { DEFAULT: '#4F6D8A', deep: '#3F5A73' },
        gray: {
          50: '#FBFAF7',
          100: '#F6F3EF',
          200: '#EAE6E0',
          300: '#DAD4C8',
          400: '#A9A294',
          500: '#797161',
          600: '#5A5448',
          700: '#453F36',
          800: '#2B2822',
          900: '#1A1814',
          950: '#0F0E0B',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', '"Noto Sans CJK SC"', '"Source Han Sans SC"', '"Noto Sans SC"', 'sans-serif'],
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', '"Noto Serif CJK SC"', '"Source Han Serif SC"', '"Noto Serif SC"', '"Songti SC"', 'STSong', 'SimSun', 'serif'],
        kai: ['"Kaiti SC"', 'STKaiti', 'KaiTi', 'KaiTi_GB2312', 'BiauKai', 'serif'],
        mono: ['ui-monospace', '"SF Mono"', 'SFMono-Regular', '"JetBrains Mono"', '"Cascadia Code"', '"Fira Code"', 'Menlo', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.76s cubic-bezier(.22,.61,.36,1)',
        'slide-up': 'slideUp 0.76s cubic-bezier(.22,.61,.36,1)',
        'slide-in': 'slideIn 0.76s cubic-bezier(.22,.61,.36,1)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
