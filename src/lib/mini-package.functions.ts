import { prisma } from '#/db'
import { createServerFn } from '@tanstack/react-start'
import { miniPackageSchema } from './validators/mini-package-schema'

export const getMiniPackages = createServerFn().handler(async () => {
  const result = await prisma.miniPackage.findMany({})
  return result
})

export const getMiniPackageDetailsByName = createServerFn()
  .validator(miniPackageSchema)
  .handler(async ({ data }) => {
    const transformedName = data.name.replace(/-/g, '_')
    const existingMiniPackage = await prisma.miniPackage.findUnique({
      where: { name: transformedName },
    })
    if (!existingMiniPackage) {
      throw new Error(`Mini Package with name ${data.name} not found`)
    }
    return existingMiniPackage
  })
