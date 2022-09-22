const getAverageValue = (values: number[]) => {
  return values.reduce((a, b) => a + b, 0) / values.length
}

export default getAverageValue
