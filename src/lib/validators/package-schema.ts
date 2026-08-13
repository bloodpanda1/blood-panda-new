import z from 'zod'

const paramNames = [
  'silver',
  'gold',
  'platinum',
  'diamond',
  'signature',
] as const

export const paramNamesSchema = z.object({
  name: z.string().refine((val) => paramNames.includes(val as any)),
})

export type ParamNames = z.infer<typeof paramNamesSchema>
