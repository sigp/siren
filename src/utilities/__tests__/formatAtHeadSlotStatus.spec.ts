import formatAtHeadSlotStatus from '../formatAtHeadSlotStatus'

describe('formatAtHeadSlotStatus', () => {
  it('should return correct status', () => {
    expect(formatAtHeadSlotStatus(0)).toBe('bg-success')
    expect(formatAtHeadSlotStatus(-1)).toBe('bg-success')
    expect(formatAtHeadSlotStatus(-3)).toBe('bg-warning')
    expect(formatAtHeadSlotStatus(-5)).toBe('bg-error')
    expect(formatAtHeadSlotStatus()).toBe('bg-dark100')
    expect(formatAtHeadSlotStatus(NaN)).toBe('bg-dark100')
  })
})
