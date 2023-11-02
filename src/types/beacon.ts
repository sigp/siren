export type BeaconValidatorInclusionResults = {
  current_epoch_active_gwei: number
  current_epoch_target_attesting_gwei: number
  previous_epoch_active_gwei: number
  previous_epoch_head_attesting_gwei: number
  previous_epoch_target_attesting_gwei: number
}

export type BeaconNodeSpecResults = {
  CONFIG_NAME: string
  DEPOSIT_CHAIN_ID: string
  DEPOSIT_CONTRACT_ADDRESS: string
  DEPOSIT_NETWORK_ID: string
  SECONDS_PER_SLOT: number
}

export type BeaconValidatorMetric = {
  attestation_hits: number
  attestation_misses: number
  attestation_hit_percentage: number
  attestation_head_hits: number
  attestation_head_misses: number
  attestation_head_hit_percentage: number
  attestation_target_hits: number
  attestation_target_misses: number
  attestation_target_hit_percentage: number
}

export type ValidatorMetricEpoch = {
  [key: string]: BeaconValidatorMetricResults
}

export type BeaconValidatorMetricResults = {
  [key: string]: BeaconValidatorMetric
}
