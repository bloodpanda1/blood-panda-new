import type { MiniPackage } from '#/types'

export const bonePack: MiniPackage = {
  id: crypto.randomUUID(),
  benefits: [
    'CBC -13',
    'Glucose Random',
    'Uric Acid',
    'Calcium',
    '25 Hydroxyvitamin D',
    'RA FACTOR',
    'Phosphorous',
    'ANTI CCP',
  ],
  orgPrice: '4700',
  disPrice: '3100',
  offerPercent: '30',
  extraFeatures: [
    '8 Tests Included',
    'NABL Certified Labs',
    'Report in 24 hrs',
  ],
}
