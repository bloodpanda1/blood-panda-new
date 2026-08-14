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

const CATEGORY_ORDER = [
  'complete_blood_count',
  'diabetic',
  'kidney_function_tests',
  'lipid_profile',
  'liver_function_tests',
  'electrolytes',
  'bone_health',
  'thyroid_function_tests',
  'tumor_marker',
  'vitamins',
  'iron_profile',
  'pancreas_profile',
  'cardiac_panel',
  'urine_complete_analysis'
]

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

    // Sort categories based on the predefined order
    existingPackage.packageCategories.sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a.name)
      const indexB = CATEGORY_ORDER.indexOf(b.name)
      
      // If a category isn't in the predefined list, put it at the end
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      
      return indexA - indexB
    })

    return existingPackage
  })
