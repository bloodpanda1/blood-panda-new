import { devtools } from '@tanstack/devtools-vite'
import { defineConfig, loadEnv } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import contentCollections from '@content-collections/vite'

import netlify from '@netlify/vite-plugin-tanstack-start'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { boneyardPlugin } from 'boneyard-js/vite'
import { nitro } from 'nitro/vite'
import path from 'node:path'
import neon from './neon-vite-plugin.ts'

const env = loadEnv('dev', process.cwd(), '')

const isDev = env['NODE_ENV'] === 'development'

const config = defineConfig({
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
      breakpoints: [
        375, 480, 576, 640, 768, 1024, 1280, 1440, 1536, 1920, 2560, 3840,
      ],
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
    netlify(),
    neon,
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
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
    ],
  },
})

export default config
