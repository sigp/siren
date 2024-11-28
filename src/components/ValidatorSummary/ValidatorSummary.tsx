import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import formatValidatorEpochData from '../../../utilities/formatValidatorEpochData'
import {
  ValidatorBalanceInfo,
  ValidatorCache,
  ValidatorCountResult,
  ValidatorInfo,
} from '../../types/validator'
import ActiveValidatorCount from '../ActiveValidatorCount/ActiveValidatorCount'
import OverallEffectiveness, {
  OverallEffectivenessProps,
} from '../OveralEffectiveness/OverallEffectiveness'
import Typography from '../Typography/Typography'
import ValidatorIncomeSummary from '../ValidatorIncomeSummary/ValidatorIncomeSummary'

export interface ValidatorSummaryProps extends OverallEffectivenessProps {
  validators: ValidatorInfo[]
  validatorNetworkData: ValidatorCountResult
  validatorCacheData: ValidatorCache
}

const ValidatorSummary: FC<ValidatorSummaryProps> = ({
  validators,
  validatorNetworkData,
  validatorCacheData,
  validatorMetricResult,
}) => {
  const { t } = useTranslation()
  const activeValidators = useMemo(() => {
    return validators
      ? validators
          .filter(
            ({ status }) =>
              status.includes('active') &&
              !status.includes('slashed') &&
              !status.includes('exiting') &&
              !status.includes('exited'),
          )
          .map(({ status, pubKey, index, name }) => ({
            status,
            pubKey,
            index: String(index),
            name,
          }))
      : []
  }, [validators])
  const totalBalance = useMemo(() => {
    return validators?.map((validator) => validator.balance).reduce((a, b) => a + b, 0)
  }, [validators])
  const validatorEpochData = useMemo<ValidatorBalanceInfo>(() => {
    return formatValidatorEpochData(validators, validatorCacheData)
  }, [validators, validatorCacheData])

  return (
    <div className='w-full max-w-850 @1540:max-w-1068 flex flex-col lg:space-x-3 shadow lg:flex-row lg:divide-x divide-y lg:divide-y-0 dark:divide-dark600 dark:border dark:border-dark600'>
      <div className='p-3 space-y-2'>
        <Typography type='text-caption2' isBold isUpperCase>
          {t('validators')}
        </Typography>
        <div className='flex justify-between lg:justify-start lg:space-x-8'>
          <Typography color='text-dark300' type='text-caption1' isCapitalize>
            {t('validatorManagement.summary.active')}
          </Typography>
          <Typography isBold type='text-caption1'>
            {activeValidators.length}
          </Typography>
        </div>
      </div>
      <div className='p-3 space-y-2'>
        <Typography type='text-caption2' isBold isUpperCase>
          {t('validatorManagement.summary.totalBalance')}
        </Typography>
        <div className='flex justify-between lg:justify-start lg:space-x-8'>
          <Typography color='text-dark300' type='text-caption1'>
            {t('validatorManagement.summary.locked')}
          </Typography>
          <Typography isBold type='text-caption1'>
            {totalBalance?.toFixed(3) || '0'} ETH
          </Typography>
        </div>
      </div>
      <ValidatorIncomeSummary
        validatorData={validatorEpochData}
        className='p-3 space-y-2 w-full lg:w-42 @1540:w-52'
      />
      <OverallEffectiveness validatorMetricResult={validatorMetricResult} />
      <div className='p-3 space-y-2'>
        <Typography type='text-caption2' isBold isUpperCase>
          {t('validatorManagement.summary.networkValidators')}
        </Typography>
        <ActiveValidatorCount validatorNetworkData={validatorNetworkData} />
      </div>
      <div className='p-3 space-y-2 opacity-20'>
        <Typography type='text-caption2' isBold isUpperCase>
          {t('validatorManagement.summary.queue')}
        </Typography>
        <Typography isBold type='text-caption1'>
          -
        </Typography>
      </div>
    </div>
  )
}

export default ValidatorSummary
