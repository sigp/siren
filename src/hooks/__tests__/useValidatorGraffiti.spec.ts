import { renderHook } from '@testing-library/react-hooks'
import useValidatorGraffiti from '../useValidatorGraffiti'
import React from 'react'
import { mockValidatorInfo } from '../../mocks/validatorResults'
import { fetchValidatorGraffiti } from '../../api/lighthouse'
import { mockedRecoilValue } from '../../../test.helpers'
import clearAllMocks = jest.clearAllMocks

jest.mock('../../api/lighthouse', () => ({
  fetchValidatorGraffiti: jest.fn(),
}))

jest.mock('recoil', () => ({
  useRecoilValue: jest.fn(),
  atom: jest.fn(),
}))

const mockedFetchValidatorGraffiti = fetchValidatorGraffiti as jest.MockedFn<
  typeof fetchValidatorGraffiti
>

describe('useValidatorGraffiti hook', () => {
  beforeEach(() => {
    clearAllMocks()
  })
  it('should return undefined', () => {
    mockedRecoilValue.mockReturnValueOnce('mock-api-token')
    mockedRecoilValue.mockReturnValueOnce('mock-validator-url')
    const { result } = renderHook(() => useValidatorGraffiti())

    expect(JSON.stringify(result.current)).toStrictEqual(
      JSON.stringify({
        graffiti: undefined,
        isLoading: false,
        updateGraffiti: () => {},
      }),
    )
  })

  it('should return graffiti', () => {
    mockedRecoilValue.mockReturnValueOnce('mock-api-token')
    mockedRecoilValue.mockReturnValueOnce('mock-validator-url')
    jest.spyOn(React, 'useState').mockReturnValueOnce([false, jest.fn()])
    jest
      .spyOn(React, 'useState')
      .mockReturnValueOnce([{ 'mock-pub-key': 'mock-graffiti' }, jest.fn()])
    const { result } = renderHook(() => useValidatorGraffiti(mockValidatorInfo))

    expect(JSON.stringify(result.current)).toEqual(
      JSON.stringify({ isLoading: false, graffiti: 'mock-graffiti', updateGraffiti: () => {} }),
    )
  })

  it('should not call fetchValidatorGraffiti', () => {
    mockedRecoilValue.mockReturnValueOnce(false)
    mockedRecoilValue.mockReturnValueOnce(undefined)
    mockedRecoilValue.mockReturnValueOnce(undefined)
    renderHook(() => useValidatorGraffiti(mockValidatorInfo))

    expect(mockedFetchValidatorGraffiti).not.toBeCalled()
  })
})
