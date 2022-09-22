export type ValidatorStatus = 'success' | 'active' | 'queue' | 'unknown' | 'active-slash'

export type ValidatorInfo = {
  title: string
  id: number
  pubKey: string
  balance: number
  rewards: number
  processed: number
  missed: number
  attested: number
  aggregated: number
  status: ValidatorStatus
}
