import generateId from '../generateId'

describe('generateId util', () => {
  it('should generate a string id with correct length', () => {
    expect(generateId(8).length).toBe(8)
  })
})
