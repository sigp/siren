import { ActivityType } from '../src/types'

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case ActivityType.DEPOSIT:
      return 'bi-currency-exchange'
    case ActivityType.IMPORT:
      return 'bi-download'
    case ActivityType.GRAFFITI:
      return 'bi-palette'
    case ActivityType.CONSOLIDATION:
      return 'bi-intersect'
    case ActivityType.PARTIAL_WITHDRAWAL:
      return 'bi-send'
    case ActivityType.FEE_RECIPIENT:
      return 'bi-wallet2'
    default:
      return 'bi-clock-history'
  }
}

export default getActivityIcon
