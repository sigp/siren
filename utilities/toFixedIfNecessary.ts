const toFixedIfNecessary = (value: number | undefined | null, decimals: number) => {
  if (value === undefined || value === null || isNaN(value)) {
    return 0
  }
  return +parseFloat(value.toFixed(decimals))
}

export default toFixedIfNecessary
