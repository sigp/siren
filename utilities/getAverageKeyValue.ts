const getAverageKeyValue = (array: any[], key: string) => {
  return array.map((array) => array[key]).reduce((a, b) => a + b, 0) / array.length
}

export default getAverageKeyValue
