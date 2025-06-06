import { ActivityType } from '../src/types'

const ACTIVITY_KEY: Record<ActivityType, string> = {
  [ActivityType.DEPOSIT]: 'deposit',
  [ActivityType.IMPORT]: 'validatorImport',
  [ActivityType.GRAFFITI]: 'updateGraffiti',
  [ActivityType.CONSOLIDATION]: 'consolidation',
  [ActivityType.PARTIAL_WITHDRAWAL]: 'partialWithdrawal',
}

const getActivityTitleKey = (type: ActivityType, isError: boolean) => {
  const base = ACTIVITY_KEY[type] ?? ''
  return `activityHistory.activities.${base}.${isError ? 'errorTitle' : 'title'}`
}

export default getActivityTitleKey
