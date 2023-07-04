import { renderHook } from '@testing-library/react-hooks'
import useParticipationRate from '../useParticipationRate'
import React from 'react'
import { fetchValidatorInclusion } from '../../api/beacon'
import { mockedRecoilValue, mockResponse } from '../../../test.helpers'
import { mockBeaconSyncResult } from '../../mocks/beaconSyncResults'
import { StatusColor } from '../../types'

const mockParticipationResult = {
  current_epoch_active_gwei: 13022634000000000,
  current_epoch_target_attesting_gwei: 10322447000000000,
  previous_epoch_active_gwei: 13022634000000000,
  previous_epoch_head_attesting_gwei: 9225503000000000,
  previous_epoch_target_attesting_gwei: 10676372000000000,
}

jest.mock('../../api/beacon', () => ({
  fetchValidatorInclusion: jest.fn(),
}))

const mockedFetchValidatorInclusion = fetchValidatorInclusion as jest.MockedFn<
  typeof fetchValidatorInclusion
>
const mockSetData = jest.fn()
const mockSetError = jest.fn()

jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
  useRecoilState: jest.fn(() => ['mock-value', jest.fn()]),
  atom: jest.fn(),
  selector: jest.fn(),
}))

describe('useParticipationRate hook', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should call fetchValidatorInclusion', () => {
    mockedRecoilValue.mockReturnValueOnce({ ...mockBeaconSyncResult, head_slot: 1234567 })
    mockedRecoilValue.mockReturnValueOnce('mocked-url')

    renderHook(() => useParticipationRate())

    expect(mockedFetchValidatorInclusion).toBeCalled()
  })
  it('should return default values', () => {
    mockedRecoilValue.mockReturnValueOnce(undefined)
    mockedRecoilValue.mockReturnValueOnce('mocked-url')
    const { result } = renderHook(() => useParticipationRate())
    expect(result.current).toEqual({
      isInsufficientData: false,
      rate: undefined,
      status: StatusColor.DARK,
    })
  })
  it('should return participation rate', () => {
    mockedRecoilValue.mockReturnValueOnce(undefined)
    mockedRecoilValue.mockReturnValueOnce('mocked-url')
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()])
    jest.spyOn(React, 'useState').mockReturnValueOnce([mockParticipationResult, jest.fn()])

    const { result } = renderHook(() => useParticipationRate())
    expect(result.current).toEqual({
      isInsufficientData: false,
      rate: 82,
      status: StatusColor.WARNING,
    })
  })
  it('should return error status', () => {
    mockedRecoilValue.mockReturnValueOnce(undefined)
    mockedRecoilValue.mockReturnValueOnce('mocked-url')
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()])
    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([
        { ...mockParticipationResult, previous_epoch_target_attesting_gwei: 1000002000000000 },
        jest.fn(),
      ])

    const { result } = renderHook(() => useParticipationRate())
    expect(result.current).toEqual({
      isInsufficientData: false,
      rate: 8,
      status: StatusColor.ERROR,
    })
  })
  it('should return success status', () => {
    mockedRecoilValue.mockReturnValueOnce(undefined)
    mockedRecoilValue.mockReturnValueOnce('mocked-url')
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()])
    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([
        { ...mockParticipationResult, previous_epoch_target_attesting_gwei: 12676372000000000 },
        jest.fn(),
      ])

    const { result } = renderHook(() => useParticipationRate())
    expect(result.current).toEqual({
      isInsufficientData: false,
      rate: 97,
      status: StatusColor.SUCCESS,
    })
  })
  it('should set mock data', () => {
    mockedRecoilValue.mockReturnValueOnce({ ...mockBeaconSyncResult, head_slot: 1234567 })
    mockedRecoilValue.mockReturnValueOnce('mocked-url')

    jest.spyOn(React, 'useState').mockReturnValue([false, mockSetData])

    mockedFetchValidatorInclusion.mockReturnValue(
      Promise.resolve({
        ...mockResponse,
        data: {
          data: mockParticipationResult,
        },
      }),
    )

    renderHook(() => useParticipationRate())

    expect(mockSetData).toBeCalled()
  })
  it('should set isInsufficientData true', () => {
    mockedRecoilValue.mockReturnValueOnce({ ...mockBeaconSyncResult, head_slot: 1234567 })
    mockedRecoilValue.mockReturnValueOnce('mocked-url')

    jest.spyOn(React, 'useState').mockReturnValueOnce([false, mockSetError])
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, mockSetData])

    mockedFetchValidatorInclusion.mockReturnValue(
      Promise.reject({
        response: {
          data: {
            message: 'NOT_FOUND: beacon state',
          },
        },
      }),
    )

    renderHook(() => useParticipationRate())

    expect(mockSetError).toBeCalled()
  })
})
