const getValuesFromObjArray = (arr: { [key: string]: any }[], key: string): (string | number)[] => {
  return arr
    .map((obj): string | number | undefined => {
      const value = key.split('.').reduce((val, part) => val?.[part], obj)
      return typeof value === 'string' || typeof value === 'number' ? value : undefined
    })
    .filter((val): val is string | number => val !== undefined)
}

export default getValuesFromObjArray
