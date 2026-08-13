// import { createClientOnlyFn } from '@tanstack/react-start'
import z from 'zod'

const clientEnvSchema = z.object({
  VITE_BETTER_AUTH_URL: z.url().min(1),
  VITE_POSTHOG_KEY: z.string().min(1),
  VITE_POSTHOG_HOST: z.string().url().optional(),
})

// export const getClientEnv = createClientOnlyFn(() => {
//   return clientEnvSchema.parse(import.meta.env)
// })
export const getClientEnv = () => clientEnvSchema.parse(import.meta.env)
