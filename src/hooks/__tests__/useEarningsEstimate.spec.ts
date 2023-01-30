import useEarningsEstimate from '../useEarningsEstimate'
import { renderHook } from '@testing-library/react-hooks'
import useValidatorEarnings from '../useValidatorEarnings'
import React from 'react'

jest.mock('../useValidatorEarnings', () => jest.fn())
const mockedEstimates = {
  total: 100,
  totalEarnings: 95,
  annualizedEarningsPercent: 0.05,
  hourlyEstimate: 1,
  dailyEstimate: 2,
  weeklyEstimate: 3,
  monthlyEstimate: 4,
}

const mockedUseValidatorEarnings = useValidatorEarnings as jest.MockedFn<
  typeof useValidatorEarnings
>
const selectEstimate = () => jest.fn()

describe('useEarningsEstimate hook', () => {
  it('should return correct default data', () => {
    mockedUseValidatorEarnings.mockReturnValue(mockedEstimates)
    jest.spyOn(React, 'useState').mockReturnValue([undefined, selectEstimate])
    const { result } = renderHook(() => useEarningsEstimate())

    expect(JSON.stringify(result.current)).toEqual(
      JSON.stringify({
        totalEarnings: mockedEstimates.totalEarnings,
        estimateSelection: undefined,
        annualizedEarningsPercent: mockedEstimates.annualizedEarningsPercent,
        estimate: mockedEstimates.totalEarnings,
        selectEstimate,
      }),
    )
  })
  it('should return hourly estimate', () => {
    mockedUseValidatorEarnings.mockReturnValue(mockedEstimates)
    jest.spyOn(React, 'useState').mockReturnValue([0, selectEstimate])
    const { result } = renderHook(() => useEarningsEstimate())

    expect(JSON.stringify(result.current)).toEqual(
      JSON.stringify({
        totalEarnings: mockedEstimates.totalEarnings,
        estimateSelection: 0,
        annualizedEarningsPercent: mockedEstimates.annualizedEarningsPercent,
        estimate: mockedEstimates.hourlyEstimate,
        selectEstimate,
      }),
    )
  })
  it('should return daily estimate', () => {
    mockedUseValidatorEarnings.mockReturnValue(mockedEstimates)
    jest.spyOn(React, 'useState').mockReturnValue([1, selectEstimate])
    const { result } = renderHook(() => useEarningsEstimate())

    expect(JSON.stringify(result.current)).toEqual(
      JSON.stringify({
        totalEarnings: mockedEstimates.totalEarnings,
        estimateSelection: 1,
        annualizedEarningsPercent: mockedEstimates.annualizedEarningsPercent,
        estimate: mockedEstimates.dailyEstimate,
        selectEstimate,
      }),
    )
  })
  it('should return weekly estimate', () => {
    mockedUseValidatorEarnings.mockReturnValue(mockedEstimates)
    jest.spyOn(React, 'useState').mockReturnValue([2, selectEstimate])
    const { result } = renderHook(() => useEarningsEstimate())

    expect(JSON.stringify(result.current)).toEqual(
      JSON.stringify({
        totalEarnings: mockedEstimates.totalEarnings,
        estimateSelection: 2,
        annualizedEarningsPercent: mockedEstimates.annualizedEarningsPercent,
        estimate: mockedEstimates.weeklyEstimate,
        selectEstimate,
      }),
    )
  })
  it('should return monthly estimate', () => {
    mockedUseValidatorEarnings.mockReturnValue(mockedEstimates)
    jest.spyOn(React, 'useState').mockReturnValue([3, selectEstimate])
    const { result } = renderHook(() => useEarningsEstimate())

    expect(JSON.stringify(result.current)).toEqual(
      JSON.stringify({
        totalEarnings: mockedEstimates.totalEarnings,
        estimateSelection: 3,
        annualizedEarningsPercent: mockedEstimates.annualizedEarningsPercent,
        estimate: mockedEstimates.monthlyEstimate,
        selectEstimate,
      }),
    )
  })
})
