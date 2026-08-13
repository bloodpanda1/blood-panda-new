import type { MiniPackage } from '#/types'

export const cardiacPack: MiniPackage = {
  id: crypto.randomUUID(),
  benefits: [
    'CBC -13',
    'Glucose Fasting',
    'Post-prandial blood glucose',
    'Glycated hemoglobin (hba1c)',
    'Lipid profile',
    'High-sensitivity c-reactive protein (hs-crp)',
  ],
  orgPrice: '2240',
  disPrice: '1600',
  offerPercent: '30',
  extraFeatures: [
    '6 Tests Included',
    'NABL Certified Labs',
    'Report in 24 hrs',
  ],
}
