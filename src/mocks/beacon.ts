export const mockEpochCacheValue = { SLOTS_PER_EPOCH: '32', SECONDS_PER_SLOT: '12' }

export const mockedSyncNodeResults = {
  beacon: { head_slot: '1', sync_distance: '1', is_syncing: false },
  execution: {
    head_block_number: '1',
    head_block_timestamp: '1',
    latest_cached_block_number: '1',
    latest_cached_block_timestamp: '1',
    voting_target_timestamp: '1',
    eth1_node_sync_status_percentage: '1',
  },
}

export const mockedSyncResults = {
  beaconSync: {
    beaconPercentage: 50,
    beaconSyncTime: 12,
    headSlot: 1,
    isSyncing: false,
    slotDistance: 2,
    syncDistance: 1,
  },
  executionSync: {
    cachedHeadSlot: 1,
    cachedHeadTimestamp: '1',
    headSlot: 1,
    headTimestamp: '1',
    isReady: false,
    syncPercentage: 1,
    votingTimestamp: '1',
  },
}

export const mockValCacheValues = [
  {
    index: '1',
    pubkey: 'fake-pub',
    status: 'active_ongoing',
    withdrawal_credentials: 'fake-creds',
  },
]

export const mockStateResults = [
  {
    index: '1',
    balance: '32000000000',
    status: 'active_ongoing',
    validator: {
      activation_eligibility_epoch: '123',
      activation_epoch: '1',
      effective_balance: '32000000000',
      exit_epoch: '1234',
      pubkey: 'mock-pubkey',
      slashed: false,
      withdrawal_epoch: '12345',
      withdrawal_credentials: 'mock-creds',
    },
  },
]

export const mockFormattedStates = [
  {
    aggregated: 0,
    attested: 0,
    balance: 32,
    index: 1,
    missed: 0,
    name: 'VAL-1',
    processed: 0,
    pubKey: 'mock-pubkey',
    rewards: 0,
    slashed: false,
    status: 'active_ongoing',
    withdrawalAddress: 'mock-creds',
  },
]
