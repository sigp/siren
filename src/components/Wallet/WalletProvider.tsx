import React, { FC } from 'react'
import { useRecoilValue } from 'recoil'
import { CURRENCY_PREFIX } from '../../constants/currencies'
import { Storage } from '../../constants/enums'
import useAccountBalance from '../../hooks/useAccountBalance'
import useLocalStorage from '../../hooks/useLocalStorage'
import { exchangeRates } from '../../recoil/atoms'
import { BeaconNodeSpecResults } from '../../types/beacon'
import { ActiveCurrencyStorage } from '../../types/storage'
import Wallet from './Wallet'
import WalletConnector from './WalletConnector'

export interface WalletProps {
  beaconSpec: BeaconNodeSpecResults
}

const WalletProvider: FC<WalletProps> = ({ beaconSpec }) => {
  const { balanceData, address, chain } = useAccountBalance()

  const [activeCurrencyStorage] = useLocalStorage<ActiveCurrencyStorage>(Storage.CURRENCY, 'USD')

  const exchangeData = useRecoilValue(exchangeRates)
  const activeRate = exchangeData?.rates[activeCurrencyStorage]

  const currency = {
    prefix: CURRENCY_PREFIX[activeCurrencyStorage],
    rate: activeRate,
  }

  return balanceData && address && chain ? (
    <Wallet
      balanceData={balanceData}
      address={address}
      chain={chain}
      beaconSpec={beaconSpec}
      currency={currency}
    />
  ) : (
    <WalletConnector />
  )
}

export default WalletProvider
