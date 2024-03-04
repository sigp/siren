import { selector } from 'recoil'
import { CURRENCY_PREFIX } from '../../constants/currencies'
import { CurrencyPrefix } from '../../types'
import { activeCurrency } from '../atoms'

export const selectCurrencyPrefix = selector<CurrencyPrefix>({
  key: 'selectCurrencyPrefix',
  get: ({ get }) => {
    const currency = get(activeCurrency)
    const prefix = CURRENCY_PREFIX[currency]

    return {
      prefix,
      formattedPrefix: prefix && prefix.length === 1 ? prefix : '',
    }
  },
})
