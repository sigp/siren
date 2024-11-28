import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { CURRENCIES } from '../../constants/constants'
import { EthExchangeRates } from '../../types'
import SelectDropDown, { OptionType, SelectDropDownProps } from '../SelectDropDown/SelectDropDown'
import { TypographyColor } from '../Typography/Typography'

export interface CurrencySelectProps extends Omit<SelectDropDownProps, 'options'> {
  onSelect: (selection: OptionType) => void
  selection: string
  color?: TypographyColor
  rates: EthExchangeRates | undefined
}

const CurrencySelect: FC<CurrencySelectProps> = ({
  selection,
  onSelect,
  color = 'text-white',
  rates,
  ...rest
}) => {
  const { t } = useTranslation()

  const currencyOptions = rates
    ? [...rates.currencies]
        .filter((currency) => CURRENCIES.includes(currency))
        .sort()
        .map((currency) => ({ title: currency }))
    : []

  return (
    <SelectDropDown
      isFilter
      color={color as TypographyColor}
      label={t('accountEarnings.chooseCurrency')}
      value={selection}
      onSelect={onSelect}
      options={currencyOptions}
      {...rest}
    />
  )
}

export default CurrencySelect
