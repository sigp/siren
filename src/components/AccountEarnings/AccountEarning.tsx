import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { formatLocalCurrency } from '../../../utilities/formatLocalCurrency'
import formatValidatorEpochData from '../../../utilities/formatValidatorEpochData'
import EthLogo from '../../assets/images/eth.svg'
import LightHouseLogo from '../../assets/images/lightHouse.svg'
import UsdcLogo from '../../assets/images/usdc.svg'
import { EARNINGS_OPTIONS } from '../../constants/constants'
import { CURRENCY_PREFIX } from '../../constants/currencies'
import { Storage } from '../../constants/enums'
import useEarningsEstimate from '../../hooks/useEarningsEstimate'
import useEpochAprEstimate from '../../hooks/useEpochAprEstimate'
import useLocalStorage from '../../hooks/useLocalStorage'
import { exchangeRates } from '../../recoil/atoms'
import { ActiveCurrencyStorage } from '../../types/storage'
import { ValidatorBalanceInfo, ValidatorCache, ValidatorInfo } from '../../types/validator'
import Button, { ButtonFace } from '../Button/Button'
import CurrencySelect from '../CurrencySelect/CurrencySelect'
import { OptionType } from '../SelectDropDown/SelectDropDown'
import Tooltip from '../ToolTip/Tooltip'
import Typography from '../Typography/Typography'
import EarningsLayout from './EarningsLayout'

export interface AccountEarningProps {
  validatorStateInfo: ValidatorInfo[]
  validatorCacheData: ValidatorCache
}

const AccountEarning: FC<AccountEarningProps> = ({ validatorStateInfo, validatorCacheData }) => {
  const { t } = useTranslation()
  const [activeCurrencyStorage, storeActiveCurrency] = useLocalStorage<ActiveCurrencyStorage>(
    Storage.CURRENCY,
    'USD',
  )

  const [currency, setCurrency] = useState(activeCurrencyStorage)

  const validatorEpochData = useMemo<ValidatorBalanceInfo>(() => {
    return formatValidatorEpochData(validatorStateInfo, validatorCacheData)
  }, [validatorStateInfo, validatorCacheData])

  const { estimate, totalEarnings, estimateSelection, selectEstimate } =
    useEarningsEstimate(validatorEpochData)
  const exchangeData = useRecoilValue(exchangeRates)

  const { estimatedApr, textColor } = useEpochAprEstimate(validatorCacheData)

  const activeRate = exchangeData?.rates[currency]
  const formattedRate = activeRate ? Number(activeRate) : 0
  const totalBalance = formattedRate * totalEarnings
  const estimatedRateConversion = formattedRate * estimate
  const isEstimate = estimateSelection !== undefined
  const timeFrame = isEstimate ? EARNINGS_OPTIONS[estimateSelection]?.title : undefined
  const viewEarnings = async (value: number) => selectEstimate(value)

  const { formattedPrefix } = useMemo(() => {
    const prefix = CURRENCY_PREFIX[currency]

    return {
      prefix,
      formattedPrefix: prefix && prefix.length === 1 ? prefix : '',
    }
  }, [currency])

  const selectCurrency = (option: OptionType) => {
    storeActiveCurrency(option as string)
    setCurrency(option as string)
  }

  return (
    <EarningsLayout>
      <div className='p-4 bg-primary200 w-28 text-center absolute z-30 md:z-50 top-0 right-10'>
        <Tooltip
          className='cursor-pointer flex justify-center space-x-2'
          id='balanceInfo'
          maxWidth={350}
          text={t('accountEarnings.balanceTooltip')}
        >
          <Typography color='text-white' type='text-caption1'>
            {t('balance')}
          </Typography>
          <i className='bi bi-info-circle text-caption1 text-dark400' />
        </Tooltip>
        <div className='w-full absolute h-1 bg-white bottom-0 left-0' />
      </div>
      <div className='relative z-30 w-full h-full'>
        <div className='w-full p-4'>
          <Typography
            fontWeight='font-light'
            className='primary-gradient-text pointer-events-none'
            color='text-transparent'
            type='text-subtitle1'
            darkMode='dark:text-white'
          >
            {t('account')}
          </Typography>
          <div className='w-full flex justify-end pr-6 pt-4'>
            <Typography color='text-white' isBold darkMode='dark:text-white' type='text-h2'>
              {formatLocalCurrency(totalEarnings, { max: 3 })} ETH
            </Typography>
          </div>
          <div className='w-full mt-6 flex items-center'>
            <LightHouseLogo className='hidden md:block text-white w-16 h-16' />
            <div className='flex-1 ml-2 md:ml-6 md:ml-12 flex items-center space-x-2 justify-between'>
              <CurrencySelect rates={exchangeData} selection={currency} onSelect={selectCurrency} />
              <div className='flex items-center flex-wrap justify-end md:justify-start md:text-left text-right space-y-4 md:space-y-0 md:space-x-4'>
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
          </div>
          <hr className='w-full h-px bg-white mt-4' />
        </div>
        <div className='bg-gradient-to-t via-transWhite from-white dark:from-darkPrimary'>
          <div className='md:px-4 flex justify-between'>
            <Typography className='hidden md:block' color='text-white'>
              {t('accountEarnings.earnings')}
            </Typography>
            <div className='flex ml-8 mr-2 sm:mr-0 flex-wrap justify-end sm:justify-start sm:flex-nowrap'>
              {EARNINGS_OPTIONS.map(({ value, title }, index) => (
                <Button
                  key={index}
                  onClick={() => viewEarnings(value)}
                  className='capitalize mr-1 mb-1'
                  type={estimateSelection === value ? ButtonFace.LIGHT_ACTIVE : ButtonFace.LIGHT}
                  padding='p-2 @1440:px-4 @1440:py-2'
                >
                  {t(title)}
                </Button>
              ))}
            </div>
          </div>
          <div className='flex justify-between space-x-2 md:space-x-0 mt-6 md:mt-2 md:p-4'>
            <div className='flex space-x-4'>
              <EthLogo className='h-10 w-10 hidden md:block' />
              <Tooltip
                className='cursor-pointer'
                id='ethInfo'
                maxWidth={200}
                text={
                  isEstimate ? t('tooltip.ethEstimate', { time: timeFrame }) : t('tooltip.ethTotal')
                }
              >
                <div className='flex space-x-2'>
                  <Typography type='text-caption1' className='uppercase' color='text-dark400'>
                    ETH
                  </Typography>
                  <i
                    id='tooltip'
                    data-tooltip-content='hello world'
                    className='bi bi-info-circle text-caption1 text-dark400'
                  />
                </div>
                <Typography
                  type='text-caption1'
                  className='md:text-subtitle3'
                  darkMode='dark:text-white'
                  family='font-roboto'
                >
                  {formatLocalCurrency(estimate, { max: 4 })} ETH
                </Typography>
              </Tooltip>
            </div>
            <div className='flex space-x-4'>
              <UsdcLogo className='h-10 w-10 hidden md:block' />
              <Tooltip
                className='cursor-pointer'
                id='fiatInfo'
                maxWidth={200}
                text={
                  isEstimate
                    ? t('tooltip.fiatEstimate', { time: timeFrame })
                    : t('tooltip.fiatTotal')
                }
              >
                <div className='flex space-x-2'>
                  <Typography type='text-caption1' isUpperCase color='text-dark400'>
                    USD
                  </Typography>
                  <i className='bi bi-info-circle text-caption1 text-dark400' />
                </div>
                <Typography
                  type='text-caption1'
                  className='md:text-subtitle3'
                  darkMode='dark:text-white'
                  family='font-roboto'
                >
                  {formattedPrefix}
                  {formatLocalCurrency(estimatedRateConversion)} {String(currency)}
                </Typography>
              </Tooltip>
            </div>
            <div>
              <Tooltip id='overallApr' maxWidth={200} text={t('tooltip.annualApr')}>
                <div className='flex space-x-2'>
                  <Typography type='text-caption1' isCapitalize color='text-dark400'>
                    {t('annualized')}
                  </Typography>
                  <i className='bi bi-info-circle text-caption1 text-dark400' />
                </div>
                <Typography
                  type='text-subtitle3'
                  color={textColor}
                  darkMode={textColor}
                  family='font-roboto'
                >
                  {estimatedApr ? estimatedApr.toFixed(2) : '---'}%
                </Typography>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </EarningsLayout>
  )
}

export default AccountEarning
