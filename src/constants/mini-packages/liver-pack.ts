import type { MiniPackage } from '#/types'

export const liverPack: MiniPackage = {
  id: crypto.randomUUID(),
  benefits: [
    'CBC -13',
    'Liver Function test',
    'Glucose Random',
    'Serology Screening',
  ],
  orgPrice: '2660',
  disPrice: '1900',
  offerPercent: '30',
  extraFeatures: [
    '4 Tests Included',
    'NABL Certified Labs',
    'Report in 24 hrs',
  ],
}
