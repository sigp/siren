import isValidJSONArray from '../isValidJson'

describe('isValidJSONArray', () => {
  it('returns true for a valid JSON array string', () => {
    expect(isValidJSONArray('[]')).toBe(true)
    expect(isValidJSONArray('[{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}]')).toBe(true)
    expect(
      isValidJSONArray(
        '[{"id": 1, "name": "John", "address": {"city": "Anytown"}}, {"id": 2, "name": "Jane", "address": {"city": "Othertown"}}]',
      ),
    ).toBe(true)
  })

  it('returns false for an invalid JSON array string', () => {
    expect(isValidJSONArray('')).toBe(false)
    expect(isValidJSONArray('foo')).toBe(false)
    expect(isValidJSONArray('[1, 2, 3]')).toBe(false)
    expect(isValidJSONArray('{"id": 1, "name": "John"}')).toBe(false)
    expect(isValidJSONArray('[{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"},]')).toBe(false)
    expect(
      isValidJSONArray(
        '[{"id": 1, "name": "John"}, {"id": 2, "name": "Jane", "address": {"city": "Othertown"}]',
      ),
    ).toBe(false)
  })
})
