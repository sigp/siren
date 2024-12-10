import { motion } from 'framer-motion'
import { FC, useMemo, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useRecoilValue } from 'recoil'
import { formatLocalCurrency } from '../../../utilities/formatLocalCurrency'
import formatTimeframe from '../../../utilities/formatTimeframe'
import { EFFECTIVE_BALANCE } from '../../constants/constants'
import { CURRENCY_PREFIX } from '../../constants/currencies'
import { Storage } from '../../constants/enums'
import useLocalStorage from '../../hooks/useLocalStorage'
import { exchangeRates } from '../../recoil/atoms'
import { TimeUnit, ValidatorRewardEstimate } from '../../types'
import { ActiveCurrencyStorage } from '../../types/storage'
import CurrencySelect from '../CurrencySelect/CurrencySelect'
import SelectDropDown, { OptionType } from '../SelectDropDown/SelectDropDown'
import Typography from '../Typography/Typography'

export interface InvestRewardsProps {
  candidateCount: number
  rewardEstimate: ValidatorRewardEstimate
}

const InvestRewards: FC<InvestRewardsProps> = ({ candidateCount, rewardEstimate }) => {
  const { t } = useTranslation()
  const { apr, totalAnnualRewards } = rewardEstimate
  const [activeCurrencyStorage] = useLocalStorage<ActiveCurrencyStorage>(Storage.CURRENCY, 'USD')
  const exchangeData = useRecoilValue(exchangeRates)

  const [currency, setCurrency] = useState(activeCurrencyStorage)
  const [unit, setUnit] = useState<TimeUnit>(TimeUnit.YEAR)

  const selectCurrency = (option: OptionType) => setCurrency(String(option))
  const activeRate = exchangeData?.rates[currency] || 0

  const { formattedPrefix } = useMemo(() => {
    const prefix = CURRENCY_PREFIX[currency]

    return {
      prefix,
      formattedPrefix: prefix && prefix.length === 1 ? prefix : '',
    }
  }, [currency])

  const stakeEthAmount = candidateCount * EFFECTIVE_BALANCE
  const count = candidateCount > 0 ? candidateCount.toString().padStart(2, '0') : '0'
  const stakeEthRate = Number(activeRate) * stakeEthAmount

  const timeFrame = formatTimeframe(unit)
  const expectedApr = (apr * timeFrame).toFixed(2)
  const expectedReward = (totalAnnualRewards * timeFrame).toFixed(2)

  const onSelect = (selection: OptionType) => setUnit(selection as TimeUnit)
  const timeLineOptions = [
    { title: t('week'), value: TimeUnit.WEEK },
    { title: t('month'), value: TimeUnit.MONTH },
    { title: t('year'), value: TimeUnit.YEAR },
  ]

  return (
    <motion.div
      initial={{ borderWidth: 0 }}
      animate={{ borderWidth: '1px' }}
      transition={{ delay: 0.2 }}
      className='w-full md:max-w-md border-style flex flex-col justify-around p-4'
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-8'>
        <div className='flex justify-between items-center'>
          <Typography color='text-dark400' darkMode='dark:text-dark400'>
            {t('validatorManagement.investmentRewards.investment')}
          </Typography>
          <Typography color='text-dark300' darkMode='dark:text-dark300' type='text-subtitle2'>
            {count}
          </Typography>
        </div>
        <div className='flex justify-between items-center'>
          <div className='space-y-2'>
            <hr className='w-8 h-0.5 border-0 dark:bg-dark100' />
            <Typography color='text-dark700' darkMode='dark:text-dark100' type='text-body'>
              <Trans i18nKey='validatorManagement.investmentRewards.stakeRequired'>
                <br />
              </Trans>
            </Typography>
          </div>
          <Typography
            type='text-subtitle1'
            color='text-primary'
            darkMode='dark:text-primary'
            isBold
          >
            {stakeEthAmount} ETH
          </Typography>
        </div>
        <div className='flex justify-between items-center'>
          <CurrencySelect
            rates={exchangeData}
            color='text-dark300'
            labelClass='xl:text-caption1'
            selection={currency}
            onSelect={selectCurrency}
          />
          <Typography color='text-dark500'>{`${formattedPrefix} ${formatLocalCurrency(stakeEthRate)}`}</Typography>
        </div>
      </motion.div>
      <motion.hr
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: 0.2 }}
        className='mx-auto h-px w-full border-style'
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-8'>
        <div className='flex justify-between items-center'>
          <Typography color='text-dark400' darkMode='dark:text-dark400'>
            {t('validatorManagement.investmentRewards.rewards')}
          </Typography>
          <Typography color='text-dark300' darkMode='dark:text-dark300' type='text-subtitle2'>
            {count}
          </Typography>
        </div>
        <div className='flex justify-between items-center'>
          <div className='space-y-2'>
            <hr className='w-8 h-0.5 border-0 dark:bg-dark100' />
            <Typography color='text-dark700' darkMode='dark:text-dark100' type='text-body'>
              <Trans i18nKey='validatorManagement.investmentRewards.calculatedReward'>
                <br />
              </Trans>
            </Typography>
          </div>
          <div>
            <Typography
              type='text-subtitle2'
              color='text-primary'
              darkMode='dark:text-primary'
              isBold
            >
              + {expectedReward} ETH
            </Typography>
            <Typography
              className='text-right'
              isCapitalize
              type='text-caption1'
              color='text-dark400'
              darkMode='dark:text-dark400'
            >
              {t('validatorManagement.investmentRewards.perUnit', { unit: unit.toLowerCase() })}
            </Typography>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <SelectDropDown
            labelClass='xl:text-caption1'
            position='bottom-full mb-5 left-0 z-50'
            color='text-dark300'
            label={t('validatorManagement.investmentRewards.selectTimeframe')}
            value={unit}
            onSelect={onSelect}
            options={timeLineOptions}
          />
          <Typography color='text-dark500'>{expectedApr} %</Typography>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default InvestRewards
