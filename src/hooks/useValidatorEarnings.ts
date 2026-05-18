import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import calculateAprPercentage from '../../utilities/calculateAprPercentage'
import calculateEpochEstimate from '../../utilities/calculateEpochEstimate'
import {
  initialEthDeposit,
  secondsInDay,
  secondsInHour,
  secondsInWeek,
} from '../constants/constants'
import { beaconNodeSpec } from '../recoil/atoms'
import { FormattedValidatorCache, ValidatorBalanceInfo } from '../types/validator'
import { useNetworkProfile } from './useNetworkProfile'

const useValidatorEarnings = (validatorData: ValidatorBalanceInfo) => {
  const spec = useRecoilValue(beaconNodeSpec)
  const profile = useNetworkProfile()
  const interval = spec?.SECONDS_PER_SLOT || 12
  const slotsPerEpoch = Number(spec?.SLOTS_PER_EPOCH) || 32
  const { validators, balances } = validatorData || {}

  const epochKeys = balances ? Object.keys(balances) : undefined
  const lastEpoch = epochKeys ? epochKeys[epochKeys.length - 1] : undefined

  const [epochCaches, setCaches] = useState<FormattedValidatorCache | undefined>()

  useEffect(() => {
    setCaches((prev) => Object.assign({} as FormattedValidatorCache, prev, balances))
  }, [lastEpoch, balances])

  const total = useMemo(() => {
    return validators?.map((validator) => validator.balance).reduce((a, b) => a + b, 0)
  }, [validators])

  const totalEarnings = useMemo(() => {
    return validators?.map((validator) => validator.rewards).reduce((a, b) => a + b, 0)
  }, [validators])

  const hourlyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInHour, interval, epochCaches, profile, slotsPerEpoch),
    [epochCaches, interval, profile, slotsPerEpoch],
  )

  const dailyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInDay, interval, epochCaches, profile, slotsPerEpoch),
    [epochCaches, interval, profile, slotsPerEpoch],
  )

  const weeklyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInWeek, interval, epochCaches, profile, slotsPerEpoch),
    [epochCaches, interval, profile, slotsPerEpoch],
  )

  const monthlyEstimate = useMemo(
    () => calculateEpochEstimate(secondsInWeek * 4, interval, epochCaches, profile, slotsPerEpoch),
    [epochCaches, interval, profile, slotsPerEpoch],
  )

  // validator.balance is already in native units (PR2: backend divides by profile.gweiDivisor),
  // so the initial-deposit baseline used for APR must also be in native units.
  const initialEth = ((validators?.length || 0) * initialEthDeposit) / profile.gweiDivisor
  const annualizedEarningsPercent = calculateAprPercentage(total, initialEth)

  return {
    total,
    totalEarnings,
    annualizedEarningsPercent,
    hourlyEstimate,
    dailyEstimate,
    weeklyEstimate,
    monthlyEstimate,
  }
}

export default useValidatorEarnings
