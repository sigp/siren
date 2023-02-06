import Typography from '../Typography/Typography'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { EARNINGS_OPTIONS } from '../../constants/constants'
import { ValidatorInfo } from '../../types/validator'
import useEarningsEstimate from '../../hooks/useEarningsEstimate'

export interface ValidatorIncomeSummaryProps {
  className?: string
  validators: ValidatorInfo[]
}

const ValidatorIncomeSummary: FC<ValidatorIncomeSummaryProps> = ({ className, validators }) => {
  const { t } = useTranslation()
  const indices = validators.map(({ index }) => String(index))
  const { estimate, estimateSelection, selectEstimate } = useEarningsEstimate(indices)

  const activeIncomeTimeFrame = EARNINGS_OPTIONS.find(
    ({ value }) => value === estimateSelection,
  )?.title

  const incrementIndex = () =>
    selectEstimate(
      estimateSelection !== undefined
        ? estimateSelection + 1 <= 3
          ? estimateSelection + 1
          : undefined
        : 0,
    )

  const decrementIndex = () =>
    selectEstimate(
      estimateSelection !== undefined
        ? estimateSelection - 1 > -1
          ? estimateSelection - 1
          : undefined
        : 3,
    )

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
          {activeIncomeTimeFrame ? t(activeIncomeTimeFrame) : ''}
        </Typography>
        <div className='flex items-center space-x-1'>
          <i
            className={`text-sm ${
              Number(estimate) > 0 ? 'bi-chevron-up text-success' : 'bi-chevron-down text-error'
            }`}
          />
          <Typography isBold type='text-caption1'>
            {estimate.toFixed(4)} ETH
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default ValidatorIncomeSummary
