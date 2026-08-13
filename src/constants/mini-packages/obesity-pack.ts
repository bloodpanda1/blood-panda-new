import type { MiniPackage } from '#/types'

export const obesityPack: MiniPackage = {
  id: crypto.randomUUID(),
  benefits: [
    'CBC -13',
    'Lipid profile',
    'Random blood glucose',
    'Insulin test',
    'High-sensitivity c-reactive protein (hs-crp)',
    'Total cortisol level',
  ],
  orgPrice: '1820',
  disPrice: '1300',
  offerPercent: '30',
  extraFeatures: [
    '6 Tests Included',
    'NABL Certified Labs',
    'Report in 24 hrs',
  ],
}
