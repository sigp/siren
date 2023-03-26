import Typography from '../Typography/Typography'
import Status from '../Status/Status'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { validatorMetrics } from '../../recoil/atoms'
import getAvgEffectivenessStatus from '../../utilities/getAvgEffectivenessStatus'
import EffectivenessBreakdown from '../EffectivenessBreakdown/EffectivenessBreakdown'
import toFixedIfNecessary from '../../utilities/toFixedIfNecessary'

const OverallEffectiveness = () => {
  const { t } = useTranslation()
  const metrics = useRecoilValue(validatorMetrics)

  const avgTargetEffectiveness = useMemo(() => {
    if (!metrics) return

    const values = metrics
      .map((metric) =>
        Object.values(metric).map((values) => values.attestation_target_hit_percentage),
      )
      .flat()
    return values.reduce((a, b) => a + b, 0) / values.length
  }, [metrics])

  const avgHitEffectiveness = useMemo(() => {
    if (!metrics) return

    const values = metrics?.flatMap((metric) =>
      Object.values(metric).map((values) => values.attestation_hit_percentage),
    )
    return values?.reduce((a, b) => a + b, 0) / values.length
  }, [metrics])

  const combinedEffectiveness =
    avgTargetEffectiveness &&
    avgHitEffectiveness &&
    (avgTargetEffectiveness + avgHitEffectiveness) / 2

  const status = getAvgEffectivenessStatus(combinedEffectiveness)

  return (
    <div className='p-3 group space-y-2 relative'>
      <Typography type='text-caption2' isBold isUpperCase>
        {t('validatorManagement.summary.avgEffectiveness')}
      </Typography>
      <div className='flex justify-between lg:justify-start lg:space-x-8'>
        <Status status={status} />
        <Typography isBold type='text-caption1'>
          {combinedEffectiveness ? `${toFixedIfNecessary(combinedEffectiveness, 2)} %` : '----'}
        </Typography>
      </div>
      <EffectivenessBreakdown
        className='group-hover:block'
        target={avgTargetEffectiveness}
        head={avgHitEffectiveness}
        targetDescription={t('validatorManagement.effectiveness.overallTargetDescription')}
        headDescription={t('validatorManagement.effectiveness.overallHeadHitDescription')}
      />
    </div>
  )
}

export default OverallEffectiveness
