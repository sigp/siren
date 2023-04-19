import getValuesFromObjArray from '../getValuesFromObjArray'

const objArray = [
  {
    id: 1,
    name: 'John',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    },
  },
  {
    id: 2,
    name: 'Jane',
    address: {
      street: '456 Elm St',
      city: 'Othertown',
      state: 'NY',
      zip: '67890',
    },
  },
]

describe('getValuesFromObjArray', () => {
  it('returns an array of values for the specified key in each object', () => {
    expect(getValuesFromObjArray(objArray, 'id')).toEqual([1, 2])
    expect(getValuesFromObjArray(objArray, 'name')).toEqual(['John', 'Jane'])
    expect(getValuesFromObjArray(objArray, 'address.street')).toEqual(['123 Main St', '456 Elm St'])
    expect(getValuesFromObjArray(objArray, 'address.city')).toEqual(['Anytown', 'Othertown'])
    expect(getValuesFromObjArray(objArray, 'address.state')).toEqual(['CA', 'NY'])
    expect(getValuesFromObjArray(objArray, 'address.zip')).toEqual(['12345', '67890'])
  })

  it('returns an empty array if the specified key is not found in any object', () => {
    expect(getValuesFromObjArray(objArray, 'foo')).toEqual([])
    expect(getValuesFromObjArray(objArray, 'address.foo')).toEqual([])
  })

  it('returns only string and number values', () => {
    const objArrayWithOtherTypes = [
      { id: 1, name: 'John', age: 25, isStudent: true },
      { id: 2, name: 'Jane', age: 30, isStudent: false },
    ]
    expect(getValuesFromObjArray(objArrayWithOtherTypes, 'id')).toEqual([1, 2])
    expect(getValuesFromObjArray(objArrayWithOtherTypes, 'name')).toEqual(['John', 'Jane'])
    expect(getValuesFromObjArray(objArrayWithOtherTypes, 'age')).toEqual([25, 30])
    expect(getValuesFromObjArray(objArrayWithOtherTypes, 'isStudent')).toEqual([])
  })
})
