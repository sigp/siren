const hashToRange = (hash: number, min: number, max: number) => {
  const normalizedHash = (((hash % 1000) + 1000) % 1000) / 1000
  return normalizedHash * (max - min) + min
}

export default hashToRange
