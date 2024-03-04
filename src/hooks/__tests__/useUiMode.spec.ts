import { renderHook } from '@testing-library/react-hooks'
import { mockedRecoilState } from '../../../test.helpers'
import { UiMode } from '../../constants/enums'
import useUiMode from '../useUiMode'
import clearAllMocks = jest.clearAllMocks

const toggleUiMode = () => jest.fn()

describe('useUiMode hook', () => {
  beforeEach(() => {
    clearAllMocks()
  })
  it('should return default values', () => {
    mockedRecoilState.mockReturnValue([undefined, toggleUiMode])
    const { result } = renderHook(() => useUiMode())

    expect(result.current.mode).toBe(undefined)
    expect(JSON.stringify(result.current.toggleUiMode)).toStrictEqual(JSON.stringify(toggleUiMode))
  })
  it('should return correct values', () => {
    mockedRecoilState.mockReturnValue([UiMode.DARK, toggleUiMode])
    const { result } = renderHook(() => useUiMode())

    expect(result.current.mode).toBe(UiMode.DARK)
  })
})
