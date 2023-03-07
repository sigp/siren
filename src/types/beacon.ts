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
}
