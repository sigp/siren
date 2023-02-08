import { renderHook } from '@testing-library/react-hooks'
import useValidatorGraffiti from '../useValidatorGraffiti'
import React from 'react'
import { mockValidatorInfo } from '../../mocks/validatorResults'
import { fetchValidatorGraffiti } from '../../api/lighthouse'
import { mockedRecoilValue, mockResponse } from '../../../test.helpers'

jest.mock('../../api/lighthouse', () => ({
  fetchValidatorGraffiti: jest.fn(),
}))

const mockedFetchValidatorGraffiti = fetchValidatorGraffiti as jest.MockedFn<
  typeof fetchValidatorGraffiti
>

describe('useValidatorGraffiti hook', () => {
  it('should return undefined', () => {
    const { result } = renderHook(() => useValidatorGraffiti())

    expect(result.current).toEqual({ graffiti: undefined })
  })

  it('should return graffiti', () => {
    jest.spyOn(React, 'useState').mockReturnValue([{ 'mock-pub-key': 'mock-graffiti' }, jest.fn()])
    const { result } = renderHook(() => useValidatorGraffiti(mockValidatorInfo))

    expect(result.current).toEqual({ graffiti: 'mock-graffiti' })
  })

  it('should not call fetchValidatorGraffiti', () => {
    renderHook(() => useValidatorGraffiti(mockValidatorInfo))

    expect(mockedFetchValidatorGraffiti).not.toBeCalled()
  })

  it('should call fetchValidatorGraffiti', () => {
    mockedFetchValidatorGraffiti.mockReturnValue(
      Promise.resolve({
        ...mockResponse,
        data: {},
      }),
    )
    mockedRecoilValue.mockReturnValueOnce('mock-validator-url')
    mockedRecoilValue.mockReturnValueOnce('mock-api-token')

    renderHook(() => useValidatorGraffiti(mockValidatorInfo))

    expect(mockedFetchValidatorGraffiti).toBeCalled()
  })
})
