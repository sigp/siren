import getAvgEffectivenessStatus from '../getAvgEffectivenessStatus'
import { StatusColor } from '../../src/types'

describe('getAvgEffectivenessStatus', () => {
  it('should return DARK status when average is undefined', () => {
    expect(getAvgEffectivenessStatus()).toBe(StatusColor.DARK)
  })

  it('should return SUCCESS status when average is greater than 95', () => {
    expect(getAvgEffectivenessStatus(96)).toBe(StatusColor.SUCCESS)
  })

  it('should return WARNING status when average is greater than 80 and less than or equal to 95', () => {
    expect(getAvgEffectivenessStatus(85)).toBe(StatusColor.WARNING)
  })

  it('should return ERROR status when average is less than or equal to 80', () => {
    expect(getAvgEffectivenessStatus(79)).toBe(StatusColor.ERROR)
  })
})
