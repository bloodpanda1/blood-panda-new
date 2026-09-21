import { PrismaClient } from './src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

async function main() {
  const prodAdapter = new PrismaPg({ connectionString: process.env.PROD_DATABASE_URL! })
  const prodDb = new PrismaClient({ adapter: prodAdapter })

  const testAdapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const testDb = new PrismaClient({ adapter: testAdapter })

  console.log('Fetching data from PROD db...')
  const prodPrimaryCategories = await prodDb.primaryCategory.findMany()
  const prodSecondaryCategories = await prodDb.secondaryCategory.findMany()
  const prodBloodTests = await prodDb.bloodTest.findMany()

  console.log(`Found ${prodPrimaryCategories.length} primary categories`)
  console.log(`Found ${prodSecondaryCategories.length} secondary categories`)
  console.log(`Found ${prodBloodTests.length} blood tests`)

  console.log('Syncing Primary Categories to TEST db...')
  for (const item of prodPrimaryCategories) {
    await testDb.primaryCategory.upsert({
      where: { id: item.id },
      create: item,
      update: item
    })
  }

  console.log('Syncing Secondary Categories to TEST db...')
  for (const item of prodSecondaryCategories) {
    await testDb.secondaryCategory.upsert({
      where: { id: item.id },
      create: item,
      update: item
    })
  }

  console.log('Syncing Blood Tests to TEST db...')
  let synced = 0
  for (const item of prodBloodTests) {
    try {
      await testDb.bloodTest.upsert({
        where: { id: item.id },
        create: item,
        update: item
      })
      synced++
    } catch (e: any) {
      console.error(`Error syncing test ${item.name}: ${e.message}`)
    }
  }

  console.log(`Successfully synced ${synced}/${prodBloodTests.length} blood tests.`)

  await prodDb.$disconnect()
  await testDb.$disconnect()
}

main().catch(console.error)
