import { StatusColor } from '../src/types'

const getAvgEffectivenessStatus = (average?: number | undefined): StatusColor => {
  if (average === undefined || isNaN(average)) {
    return StatusColor.DARK
  }

  switch (true) {
    case average > 95:
      return StatusColor.SUCCESS
    case average > 80:
      return StatusColor.WARNING
    default:
      return StatusColor.ERROR
  }
}

export default getAvgEffectivenessStatus
