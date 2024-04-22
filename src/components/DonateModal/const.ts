export interface DonateData {
  message?: string
  value: bigint
}

export enum Unit {
  Wei = 'wei',
  Gwei = 'gwei',
  Finney = 'finney',
  Ether = 'ether'
}

export const unitOptions = [
  { label: 'Wei', value: Unit.Wei },
  { label: 'Gwei', value: Unit.Gwei },
  { label: 'Finney', value: Unit.Finney },
  { label: 'Ether', value: Unit.Ether }
]
