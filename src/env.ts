// import { createEnv, type StandardSchemaV1 } from '@t3-oss/env-core'
// import { z } from 'zod'

// import { vite } from '@t3-oss/env-core/presets-valibot'

// console.log('import.meta.env', import.meta.env)

// export const env = createEnv({
//   server: {
//     NODE_ENV: z.enum(['development', 'test', 'production']),
//     DATABASE_URL: z.url(),
//     BETTER_AUTH_SECRET: z.string().min(1),
//     BETTER_AUTH_URL: z.url(),
//     RESEND_API_KEY: z.string().min(1),
//     PHONEPAY_CLIENT_ID: z.string().min(1),
//     PHONEPAY_CLIENT_SECRET: z.string().min(1),
//     PHONEPAY_CLIENT_VERSION: z.string().min(1),
//     PHONEPAY_WEBHOOK_SECRET: z.string().optional(),
//     PHONEPAY_USERNAME: z.string().min(1),
//     PHONEPAY_PASSWORD: z.string().min(1),
//   },

//   /**
//    * The prefix that client-side variables must have. This is enforced both at
//    * a type-level and at runtime.
//    */
//   clientPrefix: 'VITE_',

//   client: {
//     VITE_BETTER_AUTH_URL: z.url().min(1),
//     VITE_POSTHOG_KEY: z.string().min(1),
//   },

//   /**
//    * What object holds the environment variables at runtime. This is usually
//    * `process.env` or `import.meta.env`.
//    */
//   runtimeEnv: import.meta.env,
//   // runtimeEnv: process.env,

//   /**
//    * By default, this library will feed the environment variables directly to
//    * the Zod validator.
//    *
//    * This means that if you have an empty string for a value that is supposed
//    * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
//    * it as a type mismatch violation. Additionally, if you have an empty string
//    * for a value that is supposed to be a string with a default value (e.g.
//    * `DOMAIN=` in an ".env" file), the default value will never be applied.
//    *
//    * In order to solve these issues, we recommend that all new projects
//    * explicitly specify this option as true.
//    */
//   emptyStringAsUndefined: true,

//   extends: [vite()],

//   // Called when the schema validation fails.
//   onValidationError: (issues: StandardSchemaV1.Issue[]) => {
//     console.error('❌ Invalid environment variables:', issues)
//     throw new Error('Invalid environment variables')
//   },
//   // Called when server variables are accessed on the client.
//   onInvalidAccess: (variable: string) => {
//     throw new Error(
//       '❌ Attempted to access a server-side environment variable on the client',
//     )
//   },
// })
