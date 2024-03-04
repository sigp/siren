import { StatusColor } from '../src/types'

const formatAtHeadSlotStatus = (status?: number): StatusColor => {
  if (status === undefined) return StatusColor.DARK

  switch (true) {
    case status >= -1:
      return StatusColor.SUCCESS
    case status <= -2 && status > -5:
      return StatusColor.WARNING
    case status <= -5:
      return StatusColor.ERROR
    default:
      return StatusColor.DARK
  }
}

export default formatAtHeadSlotStatus
