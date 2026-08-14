import { devtools } from '@tanstack/devtools-vite'
import { boneyardPlugin } from 'boneyard-js/vite'
import { defineConfig, loadEnv } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import contentCollections from '@content-collections/vite'
import { nitro } from 'nitro/vite'

import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import path from 'node:path'
import neon from './neon-vite-plugin.ts'

const isBuild = process.argv.includes('build') || process.env.NODE_ENV === 'production'
if (isBuild) {
  process.env.NODE_ENV = 'production'
}

const env = loadEnv(isBuild ? 'production' : 'dev', process.cwd(), '')
const isDev = process.env.NODE_ENV !== 'production'

const config = defineConfig({
  oxc: {
    jsx: {
      development: isDev,
    },
  },
  esbuild: {
    jsxDev: false,
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Force Vite to bypass the broken relative entry point
      '@liorpo/react-hook-form-persist': path.resolve(
        __dirname,
        'node_modules/@liorpo/react-hook-form-persist/dist/index.js',
      ),
    },
  },
  plugins: [
    boneyardPlugin({
      breakpoints: [414], // iPhone 11 width
      framework: 'react',
      routes: [
        '/packages/gold',
        '/packages/diamond',
        '/packages/silver',
        '/packages/platinum',
        '/packages/signature',
        '/packages/mini-packages/renal-pack',
        '/packages/mini-packages/liver-pack',
        '/packages/mini-packages/bone-pack',
        '/packages/mini-packages/gut-pack',
        '/packages/mini-packages/fever-pack',
        '/packages/mini-packages/obesity-pack',
        '/packages/mini-packages/diabetic-pack',
        '/packages/mini-packages/hypertension-pack',
        '/packages/mini-packages/cardiac-pack',
      ],
      debug: isDev,
      // cdp: 9222,
      wait: 800,
    }),
    contentCollections(),
    devtools(),
    neon,
    tailwindcss(),
    tanstackStart(),
    nitro({ preset: 'vercel' }),
    viteReact({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
  ],
  optimizeDeps: {
    include: [
      'swiper',
      'swiper/react',
      'swiper/modules',
      'recharts',
      'countup.js',
      'odometer_countup',
      'embla-carousel-react',
      'react-slick',
    ],
  },
  ssr: {
    noExternal: ['react-slick'],
  },
})

export default config
