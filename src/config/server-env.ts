// src/config/env.ts
import { createServerOnlyFn } from '@tanstack/react-start'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),
  RESEND_API_KEY: z.string().min(1),
  PHONEPAY_CLIENT_ID: z.string().min(1),
  PHONEPAY_CLIENT_SECRET: z.string().min(1),
  PHONEPAY_CLIENT_VERSION: z.string().min(1),
  PHONEPAY_WEBHOOK_SECRET: z.string().optional(),
  PHONEPAY_USERNAME: z.string().min(1),
  PHONEPAY_PASSWORD: z.string().min(1),
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
