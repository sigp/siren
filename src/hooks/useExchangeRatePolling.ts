import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { CoinbaseExchangeRateUrl } from '../constants/constants'
import { exchangeRates } from '../recoil/atoms'
import { PollingOptions } from '../types'
import usePollApi from './usePollApi'

const useExchangeRatePolling = (options?: PollingOptions) => {
  const { time = 60 * 1000, isReady = true } = options || {}

  const setExchangeRate = useSetRecoilState(exchangeRates)

  const { data } = usePollApi({
    key: 'exchangeRate',
    time,
    isReady,
    url: CoinbaseExchangeRateUrl,
  })

  useEffect(() => {
    if (data) {
      const rates = data.data.rates
      setExchangeRate({
        rates,
        currencies: Object.keys(rates),
      })
    }
  }, [data])
}

export default useExchangeRatePolling
