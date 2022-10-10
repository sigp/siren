export type formatLocalCurrencyOptions = {
  locale?: string
  isStrict?: boolean
  min?: number
  max?: number
}

export const formatLocalCurrency = (
  amount: string | number | undefined = 0,
  options?: formatLocalCurrencyOptions,
): string => {
  const { isStrict, locale = 'en-US', min = 2, max = 2 } = options || {}

  const amountAsNumber = typeof amount === 'string' ? parseFloat(amount) : amount

  const minDecimals = isStrict && amountAsNumber % 1 === 0 ? 0 : min
  const maxDecimals = isStrict && amountAsNumber % 1 === 0 ? 0 : max

  return amountAsNumber.toLocaleString(locale, {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  })
}
