import { renderHook, act } from '@testing-library/react-hooks'
import useExitValidator from '../useExitValidator'
import { signVoluntaryExit } from '../../api/lighthouse'
import { submitSignedExit } from '../../api/beacon'
import displayToast from '../../utilities/displayToast'

jest.mock('../../api/lighthouse')
jest.mock('../../api/beacon')
jest.mock('../../utilities/displayToast')
jest.mock('react-i18next')

const mockedSignVoluntaryExit = signVoluntaryExit as jest.MockedFn<typeof signVoluntaryExit>
const mockedDisplayToast = displayToast as jest.MockedFn<typeof displayToast>
const mockedSubmitExit = submitSignedExit as jest.MockedFn<typeof submitSignedExit>

const mockExitData = {
  message: {
    epoch: 'mock-epoch',
    validator_index: '0',
  },
  signature: 'mock-signature',
}

const mockResponse = {
  data: undefined,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
}

const setup = async (signingResponse: any, submissionResponse: any) => {
  mockedSignVoluntaryExit.mockResolvedValue(signingResponse)
  mockedSubmitExit.mockResolvedValue(submissionResponse)
  const { result } = renderHook(() => useExitValidator('testToken', 'testPubKey', 'testUrl'))

  let signedExitData
  await act(async () => {
    signedExitData = await result.current.getSignedExit('testUrl')
    if (signedExitData) {
      await result.current.submitSignedMessage(signedExitData)
    }
  })

  return { result, signedExitData }
}

describe('useExitValidator', () => {
  beforeEach(() => {
    mockedSignVoluntaryExit.mockClear()
    mockedSubmitExit.mockClear()
    mockedDisplayToast.mockClear()
  })

  it('should handle successful signing and submission when returned data.data', async () => {
    const { signedExitData } = await setup(
      { ...mockResponse, data: { data: mockExitData } },
      mockResponse,
    )
    expect(signedExitData).toEqual(mockExitData)
    expect(displayToast).toHaveBeenCalledWith('success.validatorExit', 'success')
  })

  it('should handle successful signing and submission when returned data', async () => {
    const { signedExitData } = await setup({ ...mockResponse, data: mockExitData }, mockResponse)
    expect(signedExitData).toEqual(mockExitData)
    expect(displayToast).toHaveBeenCalledWith('success.validatorExit', 'success')
  })

  it('should handle error during signing', async () => {
    await setup(Promise.reject(new Error('Error during signing')), mockResponse)
    expect(displayToast).toHaveBeenCalledWith('error.unableToSignExit', 'error')
  })

  it('should handle error during submission', async () => {
    await setup(
      { ...mockResponse, data: mockExitData },
      Promise.reject(new Error('Error during submission')),
    )
    expect(displayToast).toHaveBeenCalledWith('error.invalidExit', 'error')
  })
})
