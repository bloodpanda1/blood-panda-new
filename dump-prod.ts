import { PrismaClient } from './src/generated/prisma/client.ts'
import * as fs from 'fs'

// Set DATABASE_URL to PROD_DATABASE_URL so Prisma connects to prod
process.env.DATABASE_URL = process.env.PROD_DATABASE_URL

const db = new PrismaClient({ datasourceUrl: process.env.PROD_DATABASE_URL })

async function main() {
  console.log('Fetching data from PROD db...')
  const prodPrimaryCategories = await db.primaryCategory.findMany()
  const prodSecondaryCategories = await db.secondaryCategory.findMany()
  const prodBloodTests = await db.bloodTest.findMany()
  
  fs.writeFileSync('prod_data.json', JSON.stringify({
    prodPrimaryCategories,
    prodSecondaryCategories,
    prodBloodTests
  }))
  console.log(`Dumped ${prodBloodTests.length} tests to prod_data.json`)
}

main().catch(console.error).finally(() => db.$disconnect())
