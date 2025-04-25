import { renderHook, act } from '@testing-library/react-hooks'
import axios from 'axios'
import displayToast from '../../../utilities/displayToast'
import { ToastType } from '../../types'
import useChainSafeKeyStore from '../useChainSafeKeyStore'
import useImportValidator, { ImportValidatorParams } from '../useImportValidator'

jest.mock('axios')
jest.mock('../../../utilities/displayToast')
jest.mock('../useChainSafeKeyStore')

const mockGenerateKeystore = jest.fn()
;(useChainSafeKeyStore as jest.Mock).mockReturnValue({
  generateKeystore: mockGenerateKeystore,
})

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedDisplayToast = displayToast as jest.MockedFunction<typeof displayToast>

describe('useImportValidator hook', () => {
  const validParams: ImportValidatorParams = {
    mnemonic: 'test mnemonic',
    index: 1,
    keyStorePassword: 'password',
    suggestedFeeRecipient: '0xFeeRecipient',
    onSuccess: jest.fn(),
    onError: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should successfully import and call onSuccess', async () => {
    const fakeKeystore = { data: 'keystore' }
    mockGenerateKeystore.mockResolvedValueOnce(fakeKeystore)
    mockedAxios.post.mockResolvedValueOnce({ status: 200 })

    const { result, waitForNextUpdate } = renderHook(() => useImportValidator())

    act(() => {
      result.current.importValidator(validParams)
    })

    // Wait for hook state updates
    await waitForNextUpdate()

    expect(mockGenerateKeystore).toHaveBeenCalledWith(
      validParams.mnemonic,
      validParams.index,
      validParams.keyStorePassword,
      validParams.suggestedFeeRecipient,
    )
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/validator-import', { data: fakeKeystore })
    expect(result.current.isSuccess).toBe(true)
    expect(result.current.isError).toBe(false)
    expect(validParams.onSuccess).toHaveBeenCalled()
  })

  it('should handle errors and call onError', async () => {
    mockGenerateKeystore.mockRejectedValueOnce(new Error('gen error'))

    const { result, waitForNextUpdate } = renderHook(() => useImportValidator())

    act(() => {
      result.current.importValidator(validParams)
    })

    await waitForNextUpdate()

    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(true)
    expect(validParams.onError).toHaveBeenCalled()
    expect(mockedDisplayToast).toHaveBeenCalledWith(expect.any(String), ToastType.ERROR)
  })

  it('should validate missing index and trigger error', async () => {
    const params = { ...validParams, index: undefined as any }
    const { result } = renderHook(() => useImportValidator())

    // Wrap the call in an async act so that all the setState calls flush before assertions
    await act(async () => {
      await result.current.importValidator(params)
    })

    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(true)
    expect(validParams.onError).toHaveBeenCalled()
    expect(mockedDisplayToast).toHaveBeenCalledWith(
      expect.stringMatching(/error.unexpectedValidatorImportError/),
      ToastType.ERROR,
    )
  })
})
