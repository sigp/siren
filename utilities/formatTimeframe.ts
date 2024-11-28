import { TimeUnit } from '../src/types'

const formatTimeframe = (unit: TimeUnit): number => {
  if (unit === TimeUnit.HOUR) {
    return 1 / (365.25 * 24)
  } else if (unit === TimeUnit.DAY) {
    return 1 / 365.25
  } else if (unit === TimeUnit.WEEK) {
    return 7 / 365.25
  } else if (unit === TimeUnit.MONTH) {
    return 30.44 / 365.25
  } else {
    return 1
  }
}

export default formatTimeframe
