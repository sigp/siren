import formatAtHeadSlotStatus from '../formatAtHeadSlotStatus'
import { StatusColor } from '../../src/types'

describe('formatAtHeadSlotStatus', () => {
  it('should return correct status', () => {
    expect(formatAtHeadSlotStatus(0)).toBe(StatusColor.SUCCESS)
    expect(formatAtHeadSlotStatus(-1)).toBe(StatusColor.SUCCESS)
    expect(formatAtHeadSlotStatus(-3)).toBe(StatusColor.WARNING)
    expect(formatAtHeadSlotStatus(-5)).toBe(StatusColor.ERROR)
    expect(formatAtHeadSlotStatus()).toBe(StatusColor.DARK)
    expect(formatAtHeadSlotStatus(NaN)).toBe(StatusColor.DARK)
  })
})
