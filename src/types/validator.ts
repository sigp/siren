import { StatusColor } from './index'

export type ValidatorStatus =
  | 'pending_initialized'
  | 'pending_queued'
  | 'active_ongoing'
  | 'active_exiting'
  | 'active_slashed'
  | 'exited_unslashed'
  | 'exited_slashed'
  | 'withdrawal_possible'
  | 'withdrawal_done'
  | 'active'
  | 'pending'
  | 'exited'
  | 'withdrawal'
  | 'deposit'

export type Validator = {
  pubKey: string
}

export type ValidatorDetail = {
  index: string
  pubkey: string
  status: ValidatorStatus
  withdrawal_credentials: string
}

export type ValidatorInfo = {
  name: string | undefined
  balance: number
  index: number
  pubKey: string
  rewards: number
  slashed: boolean
  withdrawalAddress: string | undefined
  status: ValidatorStatus
  processed: number
  missed: number
  attested: number
  aggregated: number
}

export type ValidatorBalanceInfo = {
  validators: ValidatorInfo[]
  balances: FormattedValidatorCache[]
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

export type ValidatorCountResult = {
  active_exiting: number
  active_ongoing: number
  active_slashed: number
  exited_slashed: number
  exited_unslashed: number
  pending_initialized: number
  pending_queued: number
  withdrawal_done: number
  withdrawal_possible: number
}

export type FormattedValidatorCache = {
  [key: number]: number[]
}

export type ValidatorCache = {
  [key: number]: ValidatorEpochResult[]
}

export type ValidatorEpochResult = {
  epoch: number
  total_balance: number
}

export type SignedExitData = {
  message: {
    epoch: string
    validator_index: string
  }
  signature: string
}

export type ValidatorInclusionData = {
  rate: number
  status: StatusColor
}
