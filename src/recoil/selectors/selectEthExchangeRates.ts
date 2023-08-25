import { selector } from 'recoil'
import axios from 'axios'

type Rates = {
  [currency: string]: number
}

type EthExchangeRates = {
  rates: Rates
  currencies: string[]
}

export const selectEthExchangeRates = selector<EthExchangeRates>({
  key: 'EthExchangeRates',
  get: async () => {
    let rates = {}
    try {
      const { data } = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
      rates = data.data.rates
    } catch (e) {
      console.error('error accessing exchange api')
    }

    return {
      rates,
      currencies: Object.keys(rates),
    }
  },
})
