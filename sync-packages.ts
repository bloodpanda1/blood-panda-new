import { PrismaClient } from './src/generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

async function main() {
  const prodAdapter = new PrismaPg({ connectionString: process.env.PROD_DATABASE_URL! })
  const prodDb = new PrismaClient({ adapter: prodAdapter })

  const testAdapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const testDb = new PrismaClient({ adapter: testAdapter })

  console.log('Fetching package data from PROD db...')
  const prodPackageCategories = await prodDb.packageCategory.findMany()
  const prodPackages = await prodDb.package.findMany({ include: { packageCategories: true } })
  const prodMiniPackages = await prodDb.miniPackage.findMany()

  console.log(`Found ${prodPackageCategories.length} package categories`)
  console.log(`Found ${prodPackages.length} packages`)
  console.log(`Found ${prodMiniPackages.length} mini packages`)

  console.log('Syncing Package Categories to TEST db...')
  for (const item of prodPackageCategories) {
    await testDb.packageCategory.upsert({
      where: { id: item.id },
      create: item,
      update: item
    })
  }

  console.log('Syncing Packages to TEST db...')
  let syncedPackages = 0
  for (const item of prodPackages) {
    try {
      const { packageCategories, ...data } = item
      await testDb.package.upsert({
        where: { id: item.id },
        create: {
          ...data,
          packageCategories: {
            connect: packageCategories.map(pc => ({ id: pc.id }))
          }
        },
        update: {
          ...data,
          packageCategories: {
            set: packageCategories.map(pc => ({ id: pc.id }))
          }
        }
      })
      syncedPackages++
    } catch (e: any) {
      console.error(`Error syncing package ${item.name}: ${e.message}`)
    }
  }
  console.log(`Successfully synced ${syncedPackages}/${prodPackages.length} packages.`)

  console.log('Syncing Mini Packages to TEST db...')
  let syncedMiniPackages = 0
  for (const item of prodMiniPackages) {
    try {
      await testDb.miniPackage.upsert({
        where: { id: item.id },
        create: item,
        update: item
      })
      syncedMiniPackages++
    } catch (e: any) {
      console.error(`Error syncing mini package ${item.name}: ${e.message}`)
    }
  }
  console.log(`Successfully synced ${syncedMiniPackages}/${prodMiniPackages.length} mini packages.`)

  await prodDb.$disconnect()
  await testDb.$disconnect()
}

main().catch(console.error)
