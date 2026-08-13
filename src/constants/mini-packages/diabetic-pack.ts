import type { MiniPackage } from '#/types'

export const diabeticPack: MiniPackage = {
  id: crypto.randomUUID(),
  benefits: [
    'Fasting blood glucose',
    'Post-prandial blood glucose',
    'Glycated hemoglobin (hba1c)',
    'Urine complete analysis',
  ],
  orgPrice: '910',
  disPrice: '650',
  offerPercent: '30',
  extraFeatures: [
    '4 Tests Included',
    'NABL Certified Labs',
    'Report in 24 hrs',
  ],
}
