import Typography from '../Typography/Typography'
import { ReactComponent as LightHouseLogo } from '../../assets/images/lightHouse.svg'
import { ReactComponent as EthLogo } from '../../assets/images/eth.svg'
import { ReactComponent as UsdcLogo } from '../../assets/images/usdc.svg'
import Button, { ButtonFace } from '../Button/Button'
import { useTranslation } from 'react-i18next'
import { EARNINGS_OPTIONS, initialEthDeposit } from '../../constants/constants';
import { useState } from 'react';
import { formatLocalCurrency } from '../../utilities/formatLocalCurrency'
import useValidatorEarnings from '../../hooks/useValidatorEarnings'
import Spinner from '../Spinner/Spinner'
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectEthExchangeRates } from '../../recoil/selectors/selectEthExchangeRates'
import SelectDropDown, { OptionType } from '../SelectDropDown/SelectDropDown'
import EarningsLayout from './EarningsLayout'
import { selectValidatorInfos } from '../../recoil/selectors/selectValidatorInfos';
import formatBalanceColor from '../../utilities/formatBalanceColor';
import { selectCurrencyPrefix } from '../../recoil/selectors/selectCurrencyPrefix';
import { activeCurrency } from '../../recoil/atoms';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ActiveCurrencyStorage } from '../../types/storage';
import { Storage } from '../../constants/enums';

export const AccountEarningFallback = () => {
  return (
    <EarningsLayout className='h-full flex items-center justify-center max-h-396'>
      <Spinner />
    </EarningsLayout>
  )
}

const AccountEarning = () => {
  const { t } = useTranslation()
  const validators = useRecoilValue(selectValidatorInfos)
  const [currency, setCurrency] = useRecoilState(activeCurrency)
  const [isLoading, setLoading] = useState(false)
  const [activeOption, setOption] = useState(0)
  const [, storeActiveCurrency] = useLocalStorage<ActiveCurrencyStorage>(Storage.CURRENCY, undefined)
  const { total, totalRewards, fetchHistory } = useValidatorEarnings(validators)
  const { formattedPrefix } = useRecoilValue(selectCurrencyPrefix)
  const [historicalAmount, setAmount] = useState<number | undefined>(undefined)
  const { rates, currencies } = useRecoilValue(selectEthExchangeRates)
  const initialEth = validators.length * initialEthDeposit;
  const annualizedPercent = (Math.pow(((total) / initialEth), 1) - 1) * 100

  const activeRate = rates[currency]
  const formattedRate = activeRate ? Number(activeRate) : 0
  const totalBalance = formattedRate * totalRewards
  const totalHistoricalBalance = formattedRate * (historicalAmount || totalRewards)

  const currencyOptions = [...currencies].sort().map((currency) => ({ title: currency }))
  const annualizedTextColor = formatBalanceColor(annualizedPercent)

  const viewEarnings = async (value: number) => {
    setOption(value)
    setAmount(undefined)

    if (value > 0) {
      setLoading(true)
      const data = await fetchHistory(value)
      if (data) {
        setAmount(data)
        setLoading(false)
      }
    }
  }
  const selectCurrency = (option: OptionType) => {
    storeActiveCurrency(option as string)
    setCurrency(option as string)
  }

  return (
    <EarningsLayout>
      <div className='p-4 bg-primary200 w-28 text-center absolute z-30 top-0 right-10'>
        <Typography color='text-white' type='text-caption1'>
          {t('balance')}
        </Typography>
        <div className='w-full absolute h-1 bg-white bottom-0 left-0' />
      </div>
      <div className='relative z-30 w-full h-full'>
        <div className='w-full p-4'>
          <Typography
            fontWeight='font-light'
            className='primary-gradient-text'
            color='text-transparent'
            type='text-subtitle1'
            darkMode='dark:text-white'
          >
            {t('account')}
          </Typography>
          <div className='w-full flex justify-end pr-6 pt-4'>
            <Typography color='text-white' isBold darkMode='dark:text-white' type='text-h2'>
              {formatLocalCurrency(totalRewards, { max: 3 })} ETH
            </Typography>
          </div>
          <div className='w-full mt-6 flex items-center'>
            <LightHouseLogo className='hidden md:block text-white w-16 h-16' />
            <div className='flex-1 ml-6 md:ml-12 flex items-center space-x-2 justify-between'>
              <div>
                <SelectDropDown
                  color='text-white'
                  label={t('accountEarnings.chooseCurrency')}
                  value={currency}
                  onSelect={selectCurrency}
                  options={currencyOptions}
                />
              </div>
              <div>
                <Typography type='text-tiny' color='text-dark300' className='uppercase' isBold>
                  {t('accountEarnings.currentRate')}
                </Typography>
                <Typography
                  color='text-white'
                  darkMode='dark:text-white'
                  type='text-caption1'
                  className='xl:text-body'
                >
                  {`${formattedPrefix}${formatLocalCurrency(formattedRate)} ${currency}/ETH`}
                </Typography>
              </div>
              <div>
                <Typography type='text-tiny' color='text-dark300' className='uppercase' isBold>
                  {t('accountEarnings.totalBalance')}
                </Typography>
                <Typography
                  color='text-white'
                  darkMode='dark:text-white'
                  type='text-caption1'
                  className='xl:text-body'
                >
                  {`${formattedPrefix}${formatLocalCurrency(totalBalance)} ${currency}`}
                </Typography>
              </div>
            </div>
          </div>
          <hr className='w-full h-px bg-white mt-4' />
        </div>
        <div className='bg-gradient-to-t via-transWhite from-white dark:from-darkPrimary'>
          <div className='md:px-4 flex justify-between'>
            <Typography className="hidden md:block" color='text-white'>{t('accountEarnings.earnings')}</Typography>
            <div className='flex ml-8 space-x-1'>
              {EARNINGS_OPTIONS.map(({ value, title }) => (
                <Button
                  key={value}
                  onClick={() => viewEarnings(value)}
                  className={'capitalize'}
                  type={activeOption === value ? ButtonFace.LIGHT_ACTIVE : ButtonFace.LIGHT}
                  padding='p-2 @1440:px-4 @1440:py-2'
                >
                  {t(title)}
                </Button>
              ))}
            </div>
          </div>
          <div className='flex justify-between space-x-2 md:space-x-0 mt-2 p-4'>
            <div className='flex space-x-4'>
              <EthLogo className='h-10 w-10' />
              <div>
                <div className='flex space-x-2'>
                  <Typography type='text-caption1' className='uppercase' color='text-dark400'>
                    Eth
                  </Typography>
                  <i className='bi bi-info-circle text-caption1 text-dark400' />
                </div>
                {isLoading ? (
                  <div className='flex h-1/2 w-24 items-center justify-center'>
                    <Spinner size='w-3 h-3' />
                  </div>
                ) : (
                  <Typography type='text-caption1' className="md:text-subtitle3" darkMode='dark:text-white' family='font-roboto'>
                    {formatLocalCurrency(historicalAmount || totalRewards, { max: 4 })} ETH
                  </Typography>
                )}
              </div>
            </div>
            <div className='flex space-x-4'>
              <UsdcLogo className='h-10 w-10' />
              <div>
                <div className='flex space-x-2'>
                  <Typography type='text-caption1' isUpperCase color='text-dark400'>
                    USD
                  </Typography>
                  <i className='bi bi-info-circle text-caption1 text-dark400' />
                </div>
                {isLoading ? (
                  <div className='flex h-1/2 w-24 items-center justify-center'>
                    <Spinner size='w-3 h-3' />
                  </div>
                ) : (
                  <Typography type='text-caption1' className="md:text-subtitle3" darkMode='dark:text-white' family='font-roboto'>
                    {formattedPrefix}
                    {formatLocalCurrency(totalHistoricalBalance)} {String(currency)}
                  </Typography>
                )}
              </div>
            </div>
            <div>
              <div className='flex space-x-2'>
                <Typography type='text-caption1' className='capitalize' color='text-dark400'>
                  {t('annualized')}
                </Typography>
                <i className='bi bi-info-circle text-caption1 text-dark400' />
              </div>
              <Typography
                type='text-subtitle3'
                color={annualizedTextColor}
                darkMode={annualizedTextColor}
                family='font-roboto'
              >
                {annualizedPercent.toFixed(2)}%
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </EarningsLayout>
  )
}

export default AccountEarning
