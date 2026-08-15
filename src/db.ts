// Trigger reload for new prisma order column
// import { neon } from '@neondatabase/serverless'

// let client: ReturnType<typeof neon>

// export async function getClient() {
//   if (!process.env.DATABASE_URL) {
//     return undefined
//   }
//   if (!client) {
//     client = await neon(process.env.DATABASE_URL!)
//   }
//   return client
// }

import { PrismaClient } from './generated/prisma/client.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
