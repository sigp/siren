import useValidatorEarnings from './useValidatorEarnings'
import { useState } from 'react'

const useEarningsEstimate = (indices?: string[]) => {
  const [estimateSelection, setEstimate] = useState<number | undefined>(undefined)
  const {
    annualizedEarningsPercent,
    totalEarnings,
    hourlyEstimate,
    dailyEstimate,
    weeklyEstimate,
    monthlyEstimate,
  } = useValidatorEarnings(indices)

  const currentEstimate = () => {
    switch (estimateSelection) {
      case 0:
        return hourlyEstimate
      case 1:
        return dailyEstimate
      case 2:
        return weeklyEstimate
      case 3:
        return monthlyEstimate
      default:
        return totalEarnings
    }
  }
  const selectEstimate = (selection?: number) => setEstimate(selection)

  return {
    totalEarnings,
    estimateSelection,
    annualizedEarningsPercent,
    estimate: currentEstimate(),
    selectEstimate,
  }
}

export default useEarningsEstimate
