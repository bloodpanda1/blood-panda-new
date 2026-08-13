import type { MiniPackage } from '#/types'

export const gutPack: MiniPackage = {
  id: crypto.randomUUID(),
  benefits: ['CBC -13', 'Stool complete examination', 'Glucose Random'],
  orgPrice: '1050',
  disPrice: '750',
  offerPercent: '30',
  extraFeatures: [
    '3 Tests Included',
    'NABL Certified Labs',
    'Report in 24 hrs',
  ],
}
