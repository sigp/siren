import getValidatorStatusStage from '../getValidatorStatusStage'

describe('getValidatorStatusStage', () => {
  it('should return correct status', () => {
    expect(getValidatorStatusStage('active')).toBe(3)
    expect(getValidatorStatusStage('pending')).toBe(2)
    expect(getValidatorStatusStage('exited')).toBe(4)
    expect(getValidatorStatusStage('withdrawal')).toBe(4)
    expect(getValidatorStatusStage('deposit')).toBe(1)
  })
})
