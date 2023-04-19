interface Obj {
  [key: string]: any
}

const getValuesFromObjArray = (arr: Obj[], key: string): (string | number)[] => {
  const keyParts = key.split('.')

  return arr.reduce((acc: (string | number)[], obj: Obj) => {
    const value = keyParts.reduce((val, part) => val?.[part], obj)
    return typeof value === 'string' || typeof value === 'number' ? [...acc, value] : acc
  }, [])
}

export default getValuesFromObjArray
