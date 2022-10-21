export type ValidatorStatus =
  | 'success'
  | 'active'
  | 'queue'
  | 'unknown'
  | 'active-slash'
  | 'active_ongoing'

export type Validator = {
  pubKey: string
  name: string
}

export type ValidatorEpochData = {
  name: string
  data: number[]
}

export type ValidatorInfo = {
  name: string
  balance: number
  index: number
  pubKey: string
  rewards: number
  slashed: boolean
  status: ValidatorStatus
  processed: number
  missed: number
  attested: number
  aggregated: number
}

export type LighthouseValidatorResult = {
  enabled: boolean
  description: string
  voting_pubkey: string
}

export type BeaconValidatorResult = {
  index: string
  balance: string
  status: ValidatorStatus
  validator: {
    activation_eligibility_epoch: string
    activation_epoch: string
    effective_balance: string
    exit_epoch: string
    pubkey: string
    slashed: boolean
    withdrawal_epoch: string
    withdrawal_credentials: string
  }
}

export type EarningOption = {
  title: string
  value: number
}
