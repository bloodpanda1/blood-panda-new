import z from 'zod'

export const selectCategorySchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  q: z.string().optional(),
  sort: z.enum(['name', 'price']).optional(),
  limit: z.number().optional(),
  page: z.number().optional(),
})

export type SelectCategorySchema = z.infer<typeof selectCategorySchema>
