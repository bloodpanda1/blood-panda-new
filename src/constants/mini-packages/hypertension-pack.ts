import type { MiniPackage } from '#/types'

export const hypertensionPack: MiniPackage = {
  id: crypto.randomUUID(),
  benefits: [
    'CBC -13',
    'Lipid profile',
    'Glucose Random',
    'Renal function test bangalore (p01702)',
    'Urine complete analysis',
  ],
  orgPrice: '2660',
  disPrice: '1900',
  offerPercent: '30',
  extraFeatures: [
    '5 Tests Included',
    'NABL Certified Labs',
    'Report in 24 hrs',
  ],
}
