import { BeaconValidatorMetricResults } from '../src/types/beacon'

const formatValidatorEffectiveness = (
  metrics: BeaconValidatorMetricResults[],
  indices?: number[],
) => {
  const targetMetrics = Object.values(metrics)
    .flatMap((data) =>
      (indices && indices.length > 0 ? indices : Object.keys(data)).map((key) => data[key]),
    )
    .filter(Boolean)

  const avgTargetEffectiveness =
    targetMetrics
      .map((metric) => metric.attestation_target_hit_percentage)
      .reduce((a, b) => a + b, 0) / targetMetrics?.length

  const avgHitEffectiveness =
    targetMetrics.map((metric) => metric.attestation_hit_percentage).reduce((a, b) => a + b, 0) /
    targetMetrics.length

  return {
    avgHitEffectiveness,
    avgTargetEffectiveness,
  }
}

export default formatValidatorEffectiveness
