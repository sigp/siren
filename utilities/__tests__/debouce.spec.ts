import { debounce } from '../debounce'
import clearAllMocks = jest.clearAllMocks

const mockCallback = jest.fn()

describe('debounce function', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it('should delay the execution of a function', () => {
    const debouncedCallback = debounce(1000, mockCallback)

    debouncedCallback()

    expect(mockCallback).not.toBeCalled()
    jest.advanceTimersByTime(900)

    expect(mockCallback).not.toBeCalled()
    jest.advanceTimersByTime(100)

    expect(mockCallback).toBeCalledTimes(1)
  })

  it('should debounce multiple calls within the delay time', () => {
    const debouncedCallback = debounce(1000, mockCallback)

    debouncedCallback()
    debouncedCallback()
    debouncedCallback()

    jest.advanceTimersByTime(900)
    expect(mockCallback).not.toBeCalled()

    jest.advanceTimersByTime(100)
    expect(mockCallback).toBeCalledTimes(1)
  })

  it('should debounce subsequent calls after the delay time', () => {
    const debouncedCallback = debounce(1000, mockCallback)

    debouncedCallback(1)
    debouncedCallback(2)

    jest.advanceTimersByTime(900)
    expect(mockCallback).not.toBeCalled()

    jest.advanceTimersByTime(100)

    expect(mockCallback).toBeCalledTimes(1)
    expect(mockCallback).toBeCalledWith(2)
  })
})
