export type formatLocalCurrencyOptions = {
    locale?: string
    isStrict?: boolean
    specificity?: number
}

export const formatLocalCurrency = (
    amount: string | number | undefined = 0,
    options?: formatLocalCurrencyOptions,
): string => {
    const {
        isStrict,
        specificity = 2,
        locale = 'en-US',
    } = options || {}

    const amountAsNumber =
        typeof amount === 'string' ? parseFloat(amount) : amount

    const decimals = isStrict && amountAsNumber % 1 === 0 ? 0 : specificity

    return amountAsNumber.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}
