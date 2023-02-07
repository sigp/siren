import addClassString from '../addClassString'

describe('addClassString util', () => {
  it('should return default class', () => {
    expect(addClassString('base-class', [])).toBe('base-class')
  })
  it('should return default and addon classes', () => {
    expect(addClassString('base-class', ['addon-class'])).toBe('base-class addon-class')
  })
  it('should return default and addon classes', () => {
    expect(addClassString('base-class', ['addon-class', undefined, 'second-addon-class'])).toBe(
      'base-class addon-class second-addon-class',
    )
  })
})
