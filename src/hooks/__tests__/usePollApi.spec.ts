import usePollApi from '../usePollApi'
import { atom } from 'recoil'
import { renderHook } from '@testing-library/react-hooks'
import { mockedRecoilState } from '../../../test.helpers'
import usePollingInterval from '../usePollingInterval'
import axios from 'axios'
import React from 'react'

jest.mock('axios')

jest.mock('../usePollingInterval', () => jest.fn())

const mockIntervalState = atom<NodeJS.Timer | undefined>({
  key: 'mockstate',
  default: undefined,
})

const mockedUsePollinterval = usePollingInterval as jest.MockedFn<typeof usePollingInterval>

describe('usePollApi hook', () => {
  beforeEach(() => {
    mockedRecoilState.mockReturnValue([undefined, jest.fn()])
    mockedUsePollinterval.mockReturnValue({ intervalId: undefined, clearPoll: jest.fn })
  })
  it('should not call axios', () => {
    renderHook(() =>
      usePollApi({ time: 1000, isReady: false, url: 'mock-url', intervalState: mockIntervalState }),
    )

    expect(axios).not.toBeCalled()
  })
  it('should not call axios if missing url', () => {
    renderHook(() =>
      usePollApi({ time: 1000, isReady: false, url: '', intervalState: mockIntervalState }),
    )

    expect(axios).not.toBeCalled()
  })
  it('should call axios', () => {
    renderHook(() =>
      usePollApi({ time: 1000, isReady: true, url: 'mock-url', intervalState: mockIntervalState }),
    )

    expect(axios).toBeCalledWith({
      url: 'mock-url',
      data: undefined,
      headers: undefined,
      params: undefined,
      method: 'get',
    })
  })
  it('should return', () => {
    jest.spyOn(React, 'useState').mockReturnValueOnce(['mock-data', jest.fn()])

    const { result } = renderHook(() =>
      usePollApi({ time: 1000, isReady: true, url: 'mock-url', intervalState: mockIntervalState }),
    )
    expect(result.current.response).toBe('mock-data')
  })
})
