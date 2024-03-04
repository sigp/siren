import { useTranslation } from 'react-i18next'
import { useRecoilState, useRecoilValue } from 'recoil'
import { CURRENCIES } from '../../constants/constants'
import { Storage } from '../../constants/enums'
import useLocalStorage from '../../hooks/useLocalStorage'
import { activeCurrency, exchangeRates } from '../../recoil/atoms'
import { ActiveCurrencyStorage } from '../../types/storage'
import SelectDropDown, { OptionType } from '../SelectDropDown/SelectDropDown'

const CurrencySelect = () => {
  const { t } = useTranslation()
  const data = useRecoilValue(exchangeRates)
  const [currency, setCurrency] = useRecoilState(activeCurrency)
  const [, storeActiveCurrency] = useLocalStorage<ActiveCurrencyStorage>(
    Storage.CURRENCY,
    undefined,
  )

  const selectCurrency = (option: OptionType) => {
    storeActiveCurrency(option as string)
    setCurrency(option as string)
  }

  const currencyOptions = data
    ? [...data.currencies]
        .filter((currency) => CURRENCIES.includes(currency))
        .sort()
        .map((currency) => ({ title: currency }))
    : []

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
