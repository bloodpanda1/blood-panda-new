import fs from 'node:fs'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './src/generated/prisma/client/index.js'

const envFile = fs.readFileSync('.env', 'utf8')
const dbUrlMatch = envFile.match(/^DATABASE_URL=(.*)$/m)
if (!dbUrlMatch) {
  console.error('DATABASE_URL not found in .env')
  process.exit(1)
}

const pool = new pg.Pool({ connectionString: dbUrlMatch[1].replace(/['"]/g, '').trim() })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Connecting to database and fetching bookings...')
  const bookings = await prisma.booking.findMany({
    include: {
      members: {
        include: {
          testItems: true,
        }
      }
    }
  })

  let deletedCount = 0

  for (const booking of bookings) {
    const hasAnyTests = booking.members.some((member: any) => member.testItems && member.testItems.length > 0)
    
    if (!hasAnyTests) {
      console.log(`Deleting empty booking ${booking.id}...`)
      await prisma.booking.delete({
        where: { id: booking.id }
      })
      deletedCount++
    }
  }

  console.log(`\nSuccessfully deleted ${deletedCount} empty bookings.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
