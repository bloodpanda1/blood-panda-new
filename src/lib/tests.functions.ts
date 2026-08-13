import { prisma } from '#/db'
import { createServerFn } from '@tanstack/react-start'
import { selectCategorySchema } from './validators/tests-schema'

export const getAllTests = createServerFn()
  .validator(selectCategorySchema.pick({ limit: true }))
  .handler(async ({ data }) => {
    if (data.limit) {
      const limitedRecords = await prisma.bloodTest.findMany({
        take: data.limit,
        orderBy: {
          name: 'asc',
        },
        where: {
          isRegularItem: true,
        },
      })
      return limitedRecords
    } else {
      const records = await prisma.bloodTest.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      return records
    }
  })

export const getPrimaryCategoryList = createServerFn().handler(async () => {
  const primary = await prisma.primaryCategory.findMany({})
  return primary.map((p) => ({ label: p.name, value: p.id }))
})

export const secondaryCategoryList = createServerFn().handler(async () => {
  const secondary = await prisma.secondaryCategory.findMany({})
  return secondary.map((s) => ({ label: s.name, value: s.id }))
})

export const loadTestsBasedOnSearch = createServerFn()
  .validator(selectCategorySchema)
  .handler(async ({ data }) => {
    const { primary, secondary, q } = data

    // If a search query is provided, perform a search based on the query
    if (q) {
      const tests = await prisma.bloodTest.findMany({
        where: {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
      })
      if (tests.length === 0) {
        return []
      }
      return tests
    } else {
      // find by both ids if no search query is provided then it will work
      const tests = await prisma.bloodTest.findMany({
        where: {
          primaryCategoryId: primary || '754513c0-4454-4fa0-83fc-c31bfd3c0e17',
          secondaryCategoryId:
            secondary || 'd5ac78e9-9937-489b-ac13-4f3a4692386b',
        },
      })
      if (tests.length === 0) {
        return []
      }
      return tests
    }
  })
