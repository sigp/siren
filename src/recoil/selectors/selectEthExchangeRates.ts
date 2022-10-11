import { selector } from 'recoil';
import axios from 'axios';

export const selectEthExchangeRates = selector({
  key: 'EthExchangeRates',
  get: async () => {
    const { data } = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=ETH')
    const rates = data.data.rates;

    return {
      rates,
      currencies: Object.keys(rates)
    };
  },
})