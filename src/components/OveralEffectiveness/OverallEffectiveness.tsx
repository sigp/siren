import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import getAvgEffectivenessStatus from '../../../utilities/getAvgEffectivenessStatus'
import toFixedIfNecessary from '../../../utilities/toFixedIfNecessary'
import { ValidatorMetricResult } from '../../types/beacon'
import EffectivenessBreakdown from '../EffectivenessBreakdown/EffectivenessBreakdown'
import Status from '../Status/Status'
import Typography from '../Typography/Typography'

export interface OverallEffectivenessProps {
  validatorMetricResult: ValidatorMetricResult
}

const OverallEffectiveness: FC<OverallEffectivenessProps> = ({ validatorMetricResult }) => {
  const { t } = useTranslation()
  const { targetEffectiveness, hitEffectiveness, totalEffectiveness } = validatorMetricResult
  const status = getAvgEffectivenessStatus(totalEffectiveness)

  return (
    <div className='p-3 group space-y-2 relative cursor-help'>
      <Typography type='text-caption2' isBold isUpperCase>
        {t('validatorManagement.summary.avgEffectiveness')}
      </Typography>
      <div className='flex justify-between lg:justify-start lg:space-x-8'>
        <Status status={status} />
        <Typography isBold type='text-caption1'>
          {totalEffectiveness ? `${toFixedIfNecessary(totalEffectiveness, 2)} %` : '----'}
        </Typography>
      </div>
      <EffectivenessBreakdown
        className='group-hover:block @1540:w-80'
        target={targetEffectiveness}
        head={hitEffectiveness}
        targetDescription={t('validatorManagement.effectiveness.overallTargetDescription')}
        headDescription={t('validatorManagement.effectiveness.overallHeadHitDescription')}
      />
    </div>
  )
}

export default OverallEffectiveness
