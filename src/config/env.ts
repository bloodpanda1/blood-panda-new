// src/config/env.ts
// import { createClientOnlyFn, createServerOnlyFn } from '@tanstack/react-start'
// import { z } from 'zod'

// const envSchema = z.object({
//   NODE_ENV: z.enum(['development', 'test', 'production']),
//   DATABASE_URL: z.url(),
//   BETTER_AUTH_SECRET: z.string().min(1),
//   BETTER_AUTH_URL: z.url(),
//   RESEND_API_KEY: z.string().min(1),
//   PHONEPAY_CLIENT_ID: z.string().min(1),
//   PHONEPAY_CLIENT_SECRET: z.string().min(1),
//   PHONEPAY_CLIENT_VERSION: z.string().min(1),
//   PHONEPAY_WEBHOOK_SECRET: z.string().optional(),
//   PHONEPAY_USERNAME: z.string().min(1),
//   PHONEPAY_PASSWORD: z.string().min(1),
// })

// const clientEnvSchema = z.object({
//   VITE_BETTER_AUTH_URL: z.url().min(1),
//   VITE_POSTHOG_KEY: z.string().min(1),
//   VITE_POSTHOG_HOST: z.string().url().optional(),
// })

// Validate server environment
// NOTE: Module-level parse runs at module load. Fine for Node.js;
// on Cloudflare Workers (and other edge runtimes) `process.env` is
// empty at module load, so wrap this in a function and call it
// inside `.handler()` instead:
//
//   export const getServerEnv = () => envSchema.parse(process.env)
//
// Then read `getServerEnv()` per-request from server functions/middleware.
// export const serverEnv = envSchema.parse(process.env)

// Validate client environment (build-time, always safe)
// export const clientEnv = clientEnvSchema.parse(import.meta.env)

// If you ever switch to Vercel's Edge Runtime (e.g. via export const runtime = 'edge'), you'd need to switch to the lazy function pattern:
// ✅ Safe for edge runtimes — called per-request inside .handler()
// export const getServerEnv = () => envSchema.parse(process.env)
// export const getClientEnv = () => clientEnvSchema.parse(import.meta.env)

/*
const myFn = createServerFn().handler(async () => {
  const env = getServerEnv() // ✅ process.env is available here
  const db = await connect(env.DATABASE_URL)
})
*/
