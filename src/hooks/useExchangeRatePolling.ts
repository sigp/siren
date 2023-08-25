import { useSetRecoilState } from 'recoil'
import { exchangeRates } from '../recoil/atoms'
import usePollApi from './usePollApi'
import { PollingOptions } from '../types'
import { CoinbaseExchangeRateUrl } from '../constants/constants'
import { useEffect } from 'react'

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
