import type { MiniPackage } from '#/types'

export const feverPack: MiniPackage = {
  id: crypto.randomUUID(),
  benefits: [
    'CBC -13',
    'Widal slide method',
    'Dengue igg/igm/ns1 card test',
    'Chikungunya igm card test',
    'Malarial parasite slide examination',
    'Urine complete analysis',
  ],
  orgPrice: '2730',
  disPrice: '1950',
  offerPercent: '30',
  extraFeatures: [
    '6 Tests Included',
    'NABL Certified Labs',
    'Report in 24 hrs',
  ],
}
