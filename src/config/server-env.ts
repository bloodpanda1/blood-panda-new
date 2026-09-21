// src/config/env.ts
import { createServerOnlyFn } from '@tanstack/react-start'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
  RESEND_API_KEY: z.string().min(1),
  PHONEPAY_CLIENT_ID: z.string().optional(),
  PHONEPAY_CLIENT_SECRET: z.string().optional(),
  PHONEPAY_CLIENT_VERSION: z.string().optional(),
  PHONEPAY_WEBHOOK_SECRET: z.string().optional(),
  PHONEPAY_USERNAME: z.string().optional(),
  PHONEPAY_PASSWORD: z.string().optional(),
  CASHFREE_APP_ID: z.string().min(1),
  CASHFREE_SECRET_KEY: z.string().min(1),
  CASHFREE_API_VERSION: z.string().default('2023-08-01'),
  CASHFREE_ENV: z.enum(['SANDBOX', 'PRODUCTION']).default('SANDBOX'),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  CLOUDINARY_UPLOAD_PRESET: z.string().min(1),
  CLOUDINARY_URL: z.string().min(1),
})

export const getServerEnv = createServerOnlyFn(() => {
  return envSchema.parse(process.env)
})
