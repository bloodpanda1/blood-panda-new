import z from 'zod'

const miniPackages = [
  'bone-pack',
  'cardiac-pack',
  'diabetic-pack',
  'fever-pack',
  'gut-pack',
  'hypertension-pack',
  'liver-pack',
  'obesity-pack',
  'renal-pack',
] as const

export const miniPackageSchema = z.object({
  // "we got renal-pack" "required renal_pack"
  name: z.string().refine((val) => miniPackages.includes(val as any)),
})
