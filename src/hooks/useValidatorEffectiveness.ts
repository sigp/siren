import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { validatorMetrics } from '../recoil/atoms'

const useValidatorEffectiveness = (indices?: string[]) => {
  const metrics = useRecoilValue(validatorMetrics)

  const targetMetrics = useMemo(() => {
    return metrics
      ?.flatMap((data) =>
        (indices && indices.length > 0 ? indices : Object.keys(data)).map((key) => data[key]),
      )
      .filter(Boolean)
  }, [metrics, indices])

  const avgTargetEffectiveness = useMemo(() => {
    return (
      targetMetrics
        ?.map((metric) => metric.attestation_target_hit_percentage)
        .reduce((a, b) => a + b, 0) / targetMetrics?.length
    )
  }, [targetMetrics])

  const avgHitEffectiveness = useMemo(() => {
    return (
      targetMetrics?.map((metric) => metric.attestation_hit_percentage).reduce((a, b) => a + b, 0) /
      targetMetrics?.length
    )
  }, [targetMetrics])

  return {
    avgHitEffectiveness,
    avgTargetEffectiveness,
  }
}

export default useValidatorEffectiveness
