import Typography from '../Typography/Typography'
import { formatLocalCurrency } from '../../utilities/formatLocalCurrency'
import ValidatorIncomeSummary from '../ValidatorIncomeSummary/ValidatorIncomeSummary'
import { ValidatorInfo } from '../../types/validator'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'
import { selectEthExchangeRates } from '../../recoil/selectors/selectEthExchangeRates'

export interface BasicValidatorMetricsProps {
  validator: ValidatorInfo
}

const BasicValidatorMetrics: FC<BasicValidatorMetricsProps> = ({ validator }) => {
  const { rates } = useRecoilValue(selectEthExchangeRates)
  const activeRate = rates.USD
  const { balance } = validator

  return (
    <div className='flex flex-col lg:space-x-3 shadow lg:flex-row lg:divide-x divide-y lg:divide-y-0 dark:divide-dark600 dark:border dark:border-dark600'>
      <div className='p-3 space-y-2'>
        <Typography type='text-caption2' isUpperCase isBold>
          ETH RATE
        </Typography>
        <div className='flex space-x-2.5'>
          <Typography type='text-caption1' color='text-dark300'>
            USD
          </Typography>
          <Typography type='text-caption1' isBold>
            ${formatLocalCurrency(activeRate)}
          </Typography>
        </div>
      </div>
      <div className='p-3 space-y-2.5'>
        <Typography type='text-caption2' isUpperCase isBold>
          VALIDATOR
        </Typography>
        <div className='flex space-x-2'>
          <Typography type='text-caption1' color='text-dark300'>
            Balance
          </Typography>
          <Typography type='text-caption1' isBold>
            {balance.toFixed(2)}
          </Typography>
        </div>
      </div>
      <ValidatorIncomeSummary validators={[validator]} className='p-3 space-y-1.5 w-42' />
    </div>
  )
}

export default BasicValidatorMetrics
