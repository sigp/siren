import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import useValidatorEarnings from '../../hooks/useValidatorEarnings'
import { FC, useEffect, useState } from 'react'
import { EARNINGS_OPTIONS } from '../../constants/constants'
import { ValidatorInfo } from '../../types/validator'

export interface ValidatorIncomeSummaryProps {
  className?: string
  validators: ValidatorInfo[]
}

const ValidatorIncomeSummary: FC<ValidatorIncomeSummaryProps> = ({ className, validators }) => {
  const { t } = useTranslation()
  const [timeFrameIndex, setIndex] = useState(1)

  const activeIncomeTimeFrame = EARNINGS_OPTIONS[timeFrameIndex]

  const { fetchHistory } = useValidatorEarnings(validators)
  const [income, setIncome] = useState('0')

  const fetchIncome = async (time: number) => {
    const earnings = await fetchHistory(time)

    if (earnings) {
      setIncome(earnings.toFixed(3))
    }
  }

  const incrementIndex = () => {
    setIndex((prev) => {
      const nextIndex = prev + 1
      return nextIndex <= EARNINGS_OPTIONS.length - 1 ? nextIndex : 0
    })
  }

  const decrementIndex = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : EARNINGS_OPTIONS.length - 1))
  }

  useEffect(() => {
    void fetchIncome(activeIncomeTimeFrame.value)
  }, [activeIncomeTimeFrame])

  return (
    <div className={className}>
      <div className='w-full flex items-center justify-between'>
        <Typography type='text-caption2' isBold isUpperCase>
          {t('validatorManagement.summary.totalIncome')}
        </Typography>
        <div className='flex space-x-2'>
          <i
            onClick={decrementIndex}
            className='bi-chevron-left cursor-pointer text-xs dark:text-dark300'
          />
          <i
            onClick={incrementIndex}
            className='bi-chevron-right cursor-pointer text-xs dark:text-dark300'
          />
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <Typography color='text-dark300' isCapitalize type='text-caption1'>
          {t(activeIncomeTimeFrame.title)}
        </Typography>
        <div className='flex items-center space-x-1'>
          <i
            className={`text-sm ${
              Number(income) > 0 ? 'bi-chevron-up text-success' : 'bi-chevron-down text-error'
            }`}
          />
          <Typography isBold type='text-caption1'>
            {income} ETH
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default ValidatorIncomeSummary
