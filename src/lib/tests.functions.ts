import { prisma } from '#/db'
import { createServerFn } from '@tanstack/react-start'
import { selectCategorySchema } from './validators/tests-schema'

export const getAllTests = createServerFn()
  .validator(selectCategorySchema.pick({ limit: true }))
  .handler(async ({ data }) => {
    if (data.limit) {
      const desiredOrderIds = [
        'fdb02adb-9491-4782-b1a0-31425db3f982', // Complete Blood Count (CBC)
        '0b5a1832-1aec-4392-9a43-fefc190a34b3', // Renal Function Test (RFT)
        '5d4fe6ec-282d-498b-a717-a30bb2d73a80', // Liver Function Test (LFT)
        'ba063008-27f8-465e-b007-6c2695e20bb1', // Serum Electrolytes (S. ELECTROLYTES)
        '0fd3a813-0723-4d03-abea-fd2bf2daa92f', // Urine Routine & Micro (URINE ROUTINE & MICRO)
        '11404ac5-5ecb-49b4-8b44-d0240dec7e4a', // Glycated Hemoglobin (HbA1c)
        'b2d01e4f-1834-4e28-b9f9-b664d0d1f9c2', // Free Thyroid Function Test (Free TFT)
        'bb887c5b-b98a-480b-8507-6a180fa00481', // Lipid Profile (LIPID PROFILE) -> FLP
        'ccb7fa69-4bb2-4c86-93e3-4350b09ba4f7', // Prothrombin Time (PT)
        '57d4cdb6-3ee7-4bda-9cb7-238a4e47493c', // Vitamin B12 (Vitamin B12)
      ]

      const specificTests = await prisma.bloodTest.findMany({
        where: {
          id: {
            in: desiredOrderIds,
          },
        },
      })

      // Sort specific tests according to desiredOrderIds
      specificTests.sort((a, b) => {
        return desiredOrderIds.indexOf(a.id) - desiredOrderIds.indexOf(b.id)
      })

      // If we still have room for more tests to reach the limit
      let remainingTests: typeof specificTests = []
      if (specificTests.length < data.limit) {
        remainingTests = await prisma.bloodTest.findMany({
          take: data.limit - specificTests.length,
          where: {
            id: {
              notIn: specificTests.map((t) => t.id),
            },
            isRegularItem: true,
          },
          orderBy: [
            { order: 'asc' },
            { name: 'asc' },
          ],
        })
      }

      return [...specificTests, ...remainingTests]
    } else {
      const records = await prisma.bloodTest.findMany({
        orderBy: [
          { order: 'asc' },
          { name: 'asc' },
        ],
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
        orderBy: [
          { order: 'asc' },
          { name: 'asc' },
        ],
      })
      if (tests.length === 0) {
        return []
      }
      return tests
    } else {
      const where: any = {}

      if (primary) {
        where.primaryCategoryId = primary
      }
      if (secondary) {
        where.secondaryCategoryId = secondary
      }

      // If neither is provided, keep the original fallback default
      if (!primary && !secondary) {
        where.primaryCategoryId = '754513c0-4454-4fa0-83fc-c31bfd3c0e17'
        where.secondaryCategoryId = 'd5ac78e9-9937-489b-ac13-4f3a4692386b'
      }

      const tests = await prisma.bloodTest.findMany({
        where,
        orderBy: [
          { order: 'asc' },
          { name: 'asc' },
        ],
      })
      if (tests.length === 0) {
        return []
      }
      return tests
    }
  })
