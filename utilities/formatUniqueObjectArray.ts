const formatUniqueObjectArray = (arr: object[]): any[] => {
  const seen = new Set()
  return arr.filter((item) => {
    const itemStr = JSON.stringify(Object.fromEntries(Object.entries(item).sort()))
    return !seen.has(itemStr) && seen.add(itemStr)
  })
}

export default formatUniqueObjectArray
