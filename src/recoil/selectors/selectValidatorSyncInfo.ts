import { selector } from 'recoil'
import { validatorSyncInfo } from '../atoms'
import { ValidatorSyncInfo } from '../../types/diagnostic'

export const selectValidatorSyncInfo = selector<ValidatorSyncInfo>({
  key: 'selectValidatorSyncInfo',
  get: ({ get }) => {
    const data = get(validatorSyncInfo)

    const {
      head_block_number,
      head_block_timestamp,
      latest_cached_block_number,
      latest_cached_block_timestamp,
      voting_target_timestamp,
      eth1_node_sync_status_percentage,
    } = data || {}

    return {
      headSlot: Number(head_block_number || 0),
      headTimestamp: head_block_timestamp,
      cachedHeadSlot: Number(latest_cached_block_number || 0),
      cachedHeadTimestamp: latest_cached_block_timestamp,
      votingTimestamp: voting_target_timestamp,
      syncPercentage: Number(eth1_node_sync_status_percentage || 0),
      isReady: eth1_node_sync_status_percentage === 100,
    }
  },
})
