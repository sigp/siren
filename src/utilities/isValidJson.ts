const isValidJSONArray = (str: string): boolean => {
  try {
    const jsonArray = JSON.parse(str)
    return Array.isArray(jsonArray) && jsonArray.every((obj) => typeof obj === 'object')
  } catch (error) {
    return false
  }
}

export default isValidJSONArray
