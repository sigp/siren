import { useRecoilValue } from 'recoil'
import { selectValidatorInfos } from '../../recoil/selectors/selectValidatorInfos'
import Typography from '../Typography/Typography'
import { useMemo } from 'react'
import Status from '../Status/Status'
import { useTranslation } from 'react-i18next'
import ValidatorIncomeSummary from '../ValidatorIncomeSummary/ValidatorIncomeSummary'
import ActiveValidatorCount from '../ActiveValidatorCount/ActiveValidatorCount'
import DisabledTooltip from '../DisabledTooltip/DisabledTooltip'

const ValidatorSummary = () => {
  const { t } = useTranslation()
  const validators = useRecoilValue(selectValidatorInfos)

  const totalBalance = useMemo(() => {
    return validators.map((validator) => validator.balance).reduce((a, b) => a + b, 0)
  }, [validators])

  return (
    <div className='w-full max-w-850 flex flex-col lg:space-x-4 shadow lg:flex-row lg:divide-x divide-y lg:divide-y-0 dark:divide-dark600 dark:border dark:border-dark600'>
      <div className='p-3 space-y-2'>
        <Typography type='text-caption2' isBold isUpperCase>
          {t('validators')}
        </Typography>
        <div className='flex justify-between lg:justify-start lg:space-x-8'>
          <Typography color='text-dark300' type='text-caption1' isCapitalize>
            {t('validatorManagement.summary.active')}
          </Typography>
          <Typography isBold type='text-caption1'>
            {validators.length}
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
            {totalBalance.toFixed(3)} ETH
          </Typography>
        </div>
      </div>
      <ValidatorIncomeSummary validators={validators} className='p-3 space-y-2 w-full lg:w-42' />
      <DisabledTooltip>
        <div className='p-3 space-y-2'>
          <Typography type='text-caption2' isBold isUpperCase>
            {t('validatorManagement.summary.avgEffectiveness')}
          </Typography>
          <div className='flex justify-between lg:justify-start lg:space-x-8'>
            <Status status='bg-dark100' />
            <Typography isBold type='text-caption1'>
              ---
            </Typography>
          </div>
        </div>
      </DisabledTooltip>
      <div className='p-3 space-y-2'>
        <Typography type='text-caption2' isBold isUpperCase>
          {t('validatorManagement.summary.networkValidators')}
        </Typography>
        <ActiveValidatorCount />
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
