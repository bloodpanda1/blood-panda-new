import { prisma } from '#/db'
import { createServerFn } from '@tanstack/react-start'
import { paramNamesSchema } from './validators/package-schema'

export const getAllPackages = createServerFn().handler(async () => {
  const packages = await prisma.package.findMany({
    select: {
      id: true,
      name: true,
      originalAmount: true,
      discountedAmount: true,
      description: true,
      offerAmount: true,
      extraFeatures: true,
      _count: {
        select: {
          packageCategories: true,
        },
      },
    },
    orderBy: {
      discountedAmount: 'asc',
    },
  })
  return packages
})

export const getPackageDeatilsByName = createServerFn()
  .validator(paramNamesSchema)
  .handler(async ({ data }) => {
    const existingPackage = await prisma.package.findUnique({
      where: { name: data.name },
      include: {
        packageCategories: true,
      },
    })
    if (!existingPackage) {
      throw new Error(`Package with name ${data.name} not found`)
    }
    return existingPackage
  })
