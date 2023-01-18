import { CURRENCIES } from '../../constants/constants'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectEthExchangeRates } from '../../recoil/selectors/selectEthExchangeRates'
import SelectDropDown, { OptionType } from '../SelectDropDown/SelectDropDown'
import { useTranslation } from 'react-i18next'
import { activeCurrency } from '../../recoil/atoms'
import useLocalStorage from '../../hooks/useLocalStorage'
import { ActiveCurrencyStorage } from '../../types/storage'
import { Storage } from '../../constants/enums'

const CurrencySelect = () => {
  const { t } = useTranslation()
  const { currencies } = useRecoilValue(selectEthExchangeRates)
  const [currency, setCurrency] = useRecoilState(activeCurrency)
  const [, storeActiveCurrency] = useLocalStorage<ActiveCurrencyStorage>(
    Storage.CURRENCY,
    undefined,
  )

  const selectCurrency = (option: OptionType) => {
    console.log(option)
    storeActiveCurrency(option as string)
    setCurrency(option as string)
  }

  const currencyOptions = [...currencies]
    .filter((currency) => CURRENCIES.includes(currency))
    .sort()
    .map((currency) => ({ title: currency }))

  return (
    <SelectDropDown
      isFilter
      color='text-white'
      label={t('accountEarnings.chooseCurrency')}
      value={currency}
      onSelect={selectCurrency}
      options={currencyOptions}
    />
  )
}

export default CurrencySelect
