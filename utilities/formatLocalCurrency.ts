export type formatLocalCurrencyOptions = {
  locale?: string
  isStrict?: boolean
  min?: number
  max?: number
}

export const formatLocalCurrency = (
  amount: string | number | undefined,
  options?: formatLocalCurrencyOptions,
): string => {
  const safeAmount = amount || 0
  const { isStrict, locale = 'en-US', min = 2, max = 2 } = options || {}

  const amountAsNumber = typeof safeAmount === 'string' ? parseFloat(safeAmount) : safeAmount

  const minDecimals = isStrict && amountAsNumber % 1 === 0 ? 0 : min
  const maxDecimals = isStrict && amountAsNumber % 1 === 0 ? 0 : max

  return amountAsNumber.toLocaleString(locale, {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  })
}
