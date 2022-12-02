import { selector } from 'recoil'
import { activeCurrency } from '../atoms'
import { CurrencyPrefix } from '../../types'
import { CURRENCY_PREFIX } from '../../constants/currencies'

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
